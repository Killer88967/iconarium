import { rm } from "node:fs/promises";

await Promise.all([
  rm("apps/web/.next", { recursive: true, force: true }),
  rm("packages/core/dist", { recursive: true, force: true }),
  rm("packages/font-awesome/dist", { recursive: true, force: true }),
  rm("packages/devicons/dist", { recursive: true, force: true }),
  rm("packages/simple-icons/dist", { recursive: true, force: true }),
]);
