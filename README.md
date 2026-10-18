# Shoppingo Site

Landing site and public recipe pages for [Shoppingo](https://github.com/igor-siergiej/shoppingo),
a shared shopping-list and recipe PWA. Static Astro output on S3 + CloudFront, live at https://d3o01nt4oiwfr9.cloudfront.net until `shoppingo.imapps.uk` is pointed at it, scaffolded from
[content-website-template](https://github.com/igor-siergiej/content-website-template).

The app itself is a separate deployment; this repo only serves the marketing pages.

## Architecture

Diagram: [docs/diagrams/architecture.excalidraw](docs/diagrams/architecture.excalidraw)
(open in excalidraw.com or the VS Code Excalidraw extension).

Visitor → CloudFront (OAC) → private S3 bucket holding `dist/`. The page's CTAs link to the
app at `https://app.shoppingo.imapps.uk`, which is deployed separately. Infra detail and
bootstrap steps: [infra/README.md](infra/README.md).

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

Dev server needs no env. `bun run test:e2e` serves the existing `dist/` via `bun run preview`,
so run `bun run build` first. CI also runs `bunx astro sync`, `tsc --noEmit` and
`bun run typecheck` (`astro check`). There are currently no vitest test files under `src/`;
Playwright covers `e2e/homepage.spec.ts`.

## Environment

| Name | Where | Purpose |
|------|-------|---------|
| `SITE_URL` | `.env` / GitHub repo variable | Astro `site` (canonical, OG, sitemap). Unset falls back to `http://localhost:4321`. |
| `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION` | GitHub repo variables | Deploy job in `ci-cd.yml` (from `terraform output`). |
| `AWS_TERRAFORM_ROLE_ARN` | GitHub repo variable | `terraform.yml` plan/apply. |
| `CLOUDFLARE_API_TOKEN` | GitHub repo secret | `terraform.yml` plan/apply: the `imapps.uk` records in `infra/dns.tf` and `infra/acm.tf`. Scope: Zone:Read + DNS:Edit on `imapps.uk` only. |

## CI / deploy

- `pull-request.yml`: lint, test (+ typecheck), e2e (Chromium), Fallow audit.
- `ci-cd.yml` (push to `main`): lint + test → build → semantic-release and deploy. Deploy assumes
  `gha-deploy` via OIDC, `aws s3 sync`s `dist/` in three passes (`_astro/*` immutable, `images/*`
  1h, everything else no-cache), then invalidates `/*`.
- `terraform.yml`: `infra/**` PRs from this repo get a plan comment; pushes to `main` apply.

## Status

- Infra follows the same split as `portfolio` in the shared AWS account: own state bucket
  `shoppingo-site-tfstate-777799876926`, own site bucket, own `shoppingo-site-gha-*` OIDC roles,
  and it reuses the account's existing GitHub OIDC provider.
- The site serves `shoppingo.imapps.uk` and `www.`: ACM cert in us-east-1, validated and pointed
  at CloudFront by DNS-only (grey cloud) CNAMEs in the Cloudflare `imapps.uk` zone. The app lives
  at `app.shoppingo.imapps.uk` (foundry Dokploy). The CloudFront function sends old app deep links
  and returning users (the app's `shoppingo_app` cookie) there; `/?home` always shows this page.
  `public/sw.js` replaces the service worker the app registered on this origin before it moved.
- Keystatic and the blog scaffolding were removed: the page is a single hand-written landing page.
- App screenshots in `src/assets/screens` are captured from the live app on a phone-sized viewport (390x844 @3x).

## Credits

UI skeleton adapted from
[leoMirandaa/shadcn-landing-page](https://github.com/leoMirandaa/shadcn-landing-page)
(MIT).
