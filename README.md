# Icon Meta

A JavaScript-first, TypeScript-enhanced metadata layer for icon providers.

The project generates typed runtime maps, JSON metadata, ESM browser modules, and classic `<script>` bundles from each provider's official metadata.

## Current providers

- Font Awesome Free
- Devicons
- Simple Icons

## Why

The API is intentionally modeled after the same idea that makes `document.createElement()` pleasant to use: one key narrows the valid values that follow it.

```ts
import { getIcon } from "@icon-meta/font-awesome";

getIcon("brands", "facebook");
//                  ^ editor suggestions are brand icons only
```

Plain JavaScript uses the exact same runtime API:

```js
import { getIcon } from "https://your-domain.example/packages/font-awesome/latest/index.js";

console.log(getIcon("brands", "facebook"));
```

Or with a classic script:

```html
<script src="https://your-domain.example/packages/font-awesome/latest/browser.js"></script>
<script>
  console.log(IconMeta.fontAwesome.getIcon("brands", "facebook"));
</script>
```

## Setup

```bash
corepack enable
pnpm install
pnpm generate
pnpm typecheck
pnpm dev
```

`pnpm generate` downloads official provider metadata and replaces the small seed datasets checked into the repository with the complete generated datasets.

## CDN output

Generation produces both mutable and version-pinned paths:

```text
/apps/web/public/packages/font-awesome/latest/index.js
/apps/web/public/packages/font-awesome/<version>/index.js
/apps/web/public/packages/devicons/latest/index.js
/apps/web/public/packages/simple-icons/latest/index.js
```

Each provider also includes `metadata.json`, `metadata.js`, `index.d.ts`, and `browser.js`.

## Important licensing note

This project indexes metadata. It does not claim ownership of provider names, trademarks, or icon artwork. Consumers are responsible for complying with the upstream provider and individual-brand licensing/guideline requirements.
