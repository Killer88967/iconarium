# Iconarium

[![Build](https://github.com/Killer88967/iconarium/actions/workflows/build.yml/badge.svg)](https://github.com/Killer88967/iconarium/actions/workflows/build.yml)
[![GitHub License](https://img.shields.io/github/license/Killer88967/iconarium)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Killer88967/iconarium)](https://github.com/Killer88967/iconarium/issues)
[![GitHub Stars](https://img.shields.io/github/stars/Killer88967/iconarium)](https://github.com/Killer88967/iconarium/stargazers)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Killer88967/iconarium)](https://github.com/Killer88967/iconarium/commits/main)

[![pnpm](https://img.shields.io/badge/pnpm-11.21.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A JavaScript-first, TypeScript-enhanced metadata layer for icon providers.

The project generates typed runtime maps, JSON metadata, ESM browser modules, and classic `<script>` bundles from each provider's official metadata.

## Current providers

- Font Awesome Free
- Devicons
- Simple Icons
- Octicons

## Why

The API is intentionally modeled after the same idea that makes `document.createElement()` pleasant to use: one key narrows the valid values that follow it.

```ts
import { getIcon } from "@iconarium/font-awesome";

getIcon("brands", "facebook");
//                  ^ editor suggestions are brand icons only
```

Plain JavaScript uses the exact same runtime API:

```js
import { getIcon } from "https://iconarium.vercel.app/packages/font-awesome/latest";

console.log(getIcon("brands", "facebook"));
```

Or with a classic script:

```html
<script src="https://iconarium.vercel.app/packages/font-awesome/latest/browser.js"></script>
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
