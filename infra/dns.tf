# tandra.uk is a Cloudflare zone. Skipped entirely while no domain is set (local.has_domain,
# see s3.tf).
data "cloudflare_zone" "site" {
  count = local.has_domain ? 1 : 0

  filter = {
    name = var.cloudflare_zone
  }
}

# DNS-only (grey cloud): CloudFront terminates TLS with the ACM cert, so Cloudflare must not
# proxy. The record waits for the cert validation and the distribution (which carries the
# aliases), so the hostname never points at CloudFront before CloudFront can answer for it.
resource "cloudflare_dns_record" "site" {
  for_each = local.has_domain ? toset([var.domain_name, "www.${var.domain_name}"]) : toset([])

  zone_id = data.cloudflare_zone.site[0].zone_id
  name    = each.value
  type    = "CNAME"
  content = aws_cloudfront_distribution.site.domain_name
  proxied = false
  ttl     = 300
  comment = "${var.project} CloudFront (Terraform)"

  depends_on = [aws_acm_certificate_validation.site]
}

# The apex held the proxied tunnel CNAME that served the app before it moved to app.tandra.uk.
# Any record already at either name is adopted into cloudflare_dns_record.site, so it changes in
# place instead of conflicting with a second record at the same name. Once Terraform manages
# the records, the lookup finds those same records and the import is a no-op.
data "cloudflare_dns_records" "existing" {
  for_each = local.has_domain ? toset([var.domain_name, "www.${var.domain_name}"]) : toset([])

  zone_id = data.cloudflare_zone.site[0].zone_id
  name    = { exact = each.value }
}

import {
  for_each = { for name, found in data.cloudflare_dns_records.existing : name => found.result[0].id if length(found.result) > 0 }

  to = cloudflare_dns_record.site[each.key]
  id = "${data.cloudflare_zone.site[0].zone_id}/${each.value}"
}
