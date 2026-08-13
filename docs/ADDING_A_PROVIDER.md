# Adding a provider

1. Add `packages/<provider>` with a tiny seed dataset and runtime API.
2. Add `generators/providers/<provider>/source.ts` that reads an official machine-readable source.
3. Add a normalizer that preserves provider-specific concepts.
4. Add a generator that writes the package `generated/` file and CDN output.
5. Add the provider to `generators/generate-all.ts`.
6. Add a docs/site card and licensing notes.
7. Run `pnpm generate`, `pnpm typecheck`, and `pnpm build`.
