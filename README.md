# Fake News Generator

URL format:

```
https://example.com/{topic}/{year}/{month}/{day}/{headline}/{base64Description}/{base64ImageUrl}?fbshid={base64Props}
```

For local dev, you must have a `.dev.vars` file with the following items:

```
SITE_NAME=Example Site
ICON_URL=https://images.example.com/favicon.ico
```

To deploy to Cloudflare, you must set two repository secrets in Github:

```
CF_API_TOKEN
DOMAIN
```
