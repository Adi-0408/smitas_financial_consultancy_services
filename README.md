# Smita's Financial Consultancy

Static React/Vite website deployed on Vercel. There is no application server, database, or authentication service. Enquiries open WhatsApp; reviews are stored on the current browser only.

## Development

Use `npm ci`, then `npm run dev` (port 3015). Run `npm run build` for production and `npm run preview` to inspect the production output. Run `node scripts/verify.mjs` to verify referenced assets and section anchors.

## Structure

- `src/App.jsx`: website sections, calculators, local reviews, forms and galleries.
- `src/Icon.jsx`: explicitly imported Lucide React icons; add new icon names to its mapping.
- `styles.css`: custom brand styles and compiled Tailwind entry.
- `tailwind.config.js`: brand theme and source scanning configuration.
- `public/assets`: runtime images referenced by string paths.
- `assets`: original artwork and HTML-imported brand images. Retained intentionally; do not delete solely because a similar public copy exists.

CSS is compiled during the build. Do not restore the Tailwind browser CDN or Lucide DOM replacement scripts. Keep complete Tailwind class names in source so the compiler can discover them.

## Verification and limitations

The optimization build passed and the package installation audit reported zero known vulnerabilities. The local browser preview could not connect through the available browser tool, so mobile/desktop visual checks and interactive regression checks remain required before claiming production readiness. Static rendering does not verify calculator interactions, overlay history, clipboard permissions, or external WhatsApp/Maps flows.

Review data is not shared between visitors. A public review system would require a backend, moderation and appropriate privacy controls. No user data or business artwork was deleted. External Google Fonts, QR generation, Maps and WhatsApp remain dependencies. The SIP account link uses the supplied HTTP short URL; validate its HTTPS destination before changing it.
