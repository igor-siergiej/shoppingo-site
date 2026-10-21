terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ACM certs for CloudFront must live in us-east-1 regardless of where everything else runs.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# tandra.uk DNS lives on Cloudflare. Reads CLOUDFLARE_API_TOKEN from the environment (a token
# scoped to Zone:Read + DNS:Edit on tandra.uk; a GitHub Actions secret in CI).
provider "cloudflare" {}
