# Google Search Console Setup

## Purpose

Google Search Console is used to monitor search visibility and indexing issues.

This site uses Search Console only for:

- checking indexing status
- submitting sitemap
- reviewing search queries
- finding crawl or page issues

It is not used for advertising.

## Setup

1. Open Google Search Console.
2. Add property: `https://jwsung91.github.io/`
3. Choose one verification method.

Recommended options:

### Option A. HTML file verification

Upload the provided verification HTML file to `public/`.

Example:

```text
public/googlexxxxxxxxxxxxxxxx.html
```

After deployment, verify that the file is accessible:

```text
https://jwsung91.github.io/googlexxxxxxxxxxxxxxxx.html
```

### Option B. HTML meta tag verification

Set the verification token as an environment variable:

```env
PUBLIC_GOOGLE_SITE_VERIFICATION=verification-token
```

The site layout renders the verification meta tag only when this value is present.

Expected output:

```html
<meta name="google-site-verification" content="verification-token" />
```

1. Submit sitemap:

```text
https://jwsung91.github.io/sitemap-index.xml
```

## What to check

- Pages are indexed
- Sitemap is processed
- Search queries are relevant
- Important project pages are discoverable
- No unexpected crawl errors
