# imapps.uk is a Cloudflare zone. Skipped entirely while no domain is set (local.has_domain,
# see s3.tf).
data "cloudflare_zone" "site" {
  count = local.has_domain ? 1 : 0

  filter = {
    name = var.cloudflare_zone
  }
}

# DNS-only (grey cloud): CloudFront terminates TLS with the ACM cert, so Cloudflare must not
# proxy. The apex record replaces the proxied tunnel CNAME that served the app here before it
# moved to app.shoppingo.imapps.uk. The record waits for the cert validation and the
# distribution (which carries the aliases), so the hostname never points at CloudFront before
# CloudFront can answer for it.
resource "cloudflare_dns_record" "site" {
  for_each = local.has_domain ? toset([var.domain_name, "www.${var.domain_name}"]) : toset([])

  zone_id = data.cloudflare_zone.site[0].zone_id
  name    = each.value
  type    = "CNAME"
  content = aws_cloudfront_distribution.site.domain_name
  proxied = false
  ttl     = 300
  comment = "shoppingo-site CloudFront (Terraform)"

  depends_on = [aws_acm_certificate_validation.site]
}
