# Shoppingo Site

Landing site and public recipe pages for [Shoppingo](https://github.com/igor-siergiej/shoppingo),
a shared shopping-list and recipe PWA. Static Astro output on S3 + CloudFront, live at https://d3o01nt4oiwfr9.cloudfront.net until `shoppingo.imapps.uk` is pointed at it, scaffolded from
[content-website-template](https://github.com/igor-siergiej/content-website-template).

The app itself is a separate deployment; this repo only serves the marketing pages.

## Stack

| Concern | Choice |
|---------|--------|
| Runtime / package manager | Bun |
| Framework | Astro 7 (static output) |
| UI | Astro components, Tailwind v4, Bricolage Grotesque + Montserrat (self-hosted) |
| Lint / format | Biome |
| Hooks | Husky + lint-staged + commitlint (Conventional Commits) |
| Release | semantic-release |
| Dead code | Fallow |
| CI | GitHub Actions (`.github/workflows`) |
| Infra | Terraform (`infra/`) — S3 + CloudFront + GitHub OIDC, no servers |

## Commands

```bash
bun run dev            # dev server, :4321
bun run build          # static build -> dist/
bun run preview        # preview the static build
bun run lint           # biome check
bun run test           # vitest
bun run test:e2e       # playwright
```

## Status

- Infra follows the same split as `portfolio` in the shared AWS account: own state bucket
  `shoppingo-site-tfstate-777799876926`, own site bucket, own `shoppingo-site-gha-*` OIDC roles,
  and it reuses the account's existing GitHub OIDC provider. Not applied yet.
- `domain_name` is blank, so the first apply serves the site only on its `*.cloudfront.net`
  URL. `imapps.uk` DNS lives in Cloudflare, not Route 53, so wiring `shoppingo.imapps.uk`
  needs the Cloudflare provider in place of `route53.tf` before the domain is set.
- Keystatic and the blog scaffolding were removed: the page is a single hand-written landing page.
- App screenshots in `src/assets/screens` are captured from the live app on a phone-sized viewport (390x844 @3x).

## Credits

UI skeleton adapted from
[leoMirandaa/shadcn-landing-page](https://github.com/leoMirandaa/shadcn-landing-page)
(MIT).
