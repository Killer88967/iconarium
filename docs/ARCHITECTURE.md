# Architecture

## Rule 1: runtime first

Every provider exports ordinary JavaScript objects/functions. TypeScript declarations enhance the same API; they are not required to use it.

## Rule 2: provider adapters

Each provider has three generator phases:

1. `source.ts` fetches official upstream data.
2. `normalize.ts` converts it to our internal metadata shape while preserving provider-specific concepts.
3. `generate.ts` writes workspace TypeScript plus public CDN assets.

## Rule 3: dependent-key typing

Whenever one selection determines another, use a keyed map so editors can narrow suggestions. Font Awesome style → icon name and Devicon name → variant are the first examples.

## Rule 4: do not flatten provider semantics

Font Awesome has styles; Devicons has variants; Simple Icons is a brand catalog. Common metadata is shared, but native concepts remain native.

## Rule 5: versioned CDN output

`latest` is convenient and mutable. Exact provider versions are intended for production pinning and may be cached immutably by the deployment layer.
