# Must be requested in us-east-1 — CloudFront only accepts certs from that region.
# Skipped entirely while no domain is set (local.has_domain, see s3.tf) — CloudFront falls
# back to its default *.cloudfront.net certificate.
resource "aws_acm_certificate" "site" {
  count = local.has_domain ? 1 : 0

  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# DNS-only, and kept after validation so ACM can renew the cert automatically.
resource "cloudflare_dns_record" "cert_validation" {
  for_each = local.has_domain ? {
    for dvo in aws_acm_certificate.site[0].domain_validation_options : dvo.domain_name => {
      name   = trimsuffix(dvo.resource_record_name, ".")
      record = trimsuffix(dvo.resource_record_value, ".")
      type   = dvo.resource_record_type
    }
  } : {}

  zone_id = data.cloudflare_zone.site[0].zone_id
  name    = each.value.name
  type    = each.value.type
  content = each.value.record
  proxied = false
  ttl     = 60
  comment = "shoppingo-site ACM validation (Terraform)"
}

resource "aws_acm_certificate_validation" "site" {
  count = local.has_domain ? 1 : 0

  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site[0].arn
  validation_record_fqdns = [for r in cloudflare_dns_record.cert_validation : r.name]
}
