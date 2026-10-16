terraform {
  backend "s3" {
    bucket       = "shoppingo-site-tfstate-777799876926" # must match var.tfstate_bucket
    key          = "shoppingo-site/terraform.tfstate"
    region       = "eu-west-2"
    encrypt      = true
    use_lockfile = true # native S3 lock (Terraform >= 1.11), no DynamoDB needed
  }
}
