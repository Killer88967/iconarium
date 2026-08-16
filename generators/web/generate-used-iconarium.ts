import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

interface UsedIcon {
  name: string;
  size: number;
}

interface GeneratedIconData {
  width: number;
  path: string;
}

const WEB_ROOT = "apps/web";
const DEFAULT_SIZE = 24;

async function collectAllIconariumIcons() {
  const directory = path.join("packages", "iconarium", "icons");
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const icons = new Map<string, Set<number>>();

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const match = entry.name.match(/^(.+)-(\d+)\.svg$/);

    if (!match) {
      continue;
    }

    const [, name, sizeValue] = match;
    const size = Number(sizeValue);

    if (!Number.isFinite(size)) {
      continue;
    }

    let sizes = icons.get(name);

    if (!sizes) {
      sizes = new Set<number>();
      icons.set(name, sizes);
    }

    sizes.add(size);
  }

  return icons;
}

async function findTsxFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === "generated" ||
      entry.name === "public"
    ) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findTsxFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(entryPath);
    }
  }

  return files;
}

function findVariableDeclaration(
  sourceFile: ts.SourceFile,
  name: string,
): ts.VariableDeclaration | undefined {
  let found: ts.VariableDeclaration | undefined;

  function visit(node: ts.Node) {
    if (found) {
      return;
    }

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      found = node;
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return found;
}

function resolveStringValues(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  visited = new Set<string>(),
): string[] {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return [node.text];
  }

  if (ts.isParenthesizedExpression(node)) {
    return resolveStringValues(node.expression, sourceFile, visited);
  }

  if (ts.isAsExpression(node)) {
    return resolveStringValues(node.expression, sourceFile, visited);
  }

  if (ts.isSatisfiesExpression(node)) {
    return resolveStringValues(node.expression, sourceFile, visited);
  }

  if (ts.isIdentifier(node)) {
    if (visited.has(node.text)) {
      return [];
    }

    const nextVisited = new Set(visited);
    nextVisited.add(node.text);

    const declaration = findVariableDeclaration(sourceFile, node.text);

    if (!declaration?.initializer) {
      return [];
    }

    return resolveStringValues(
      declaration.initializer,
      sourceFile,
      nextVisited,
    );
  }

  if (ts.isConditionalExpression(node)) {
    return [
      ...new Set([
        ...resolveStringValues(node.whenTrue, sourceFile, new Set(visited)),
        ...resolveStringValues(node.whenFalse, sourceFile, new Set(visited)),
      ]),
    ];
  }

  return [];
}

function resolveNumberValues(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  visited = new Set<string>(),
): number[] {
  if (ts.isNumericLiteral(node)) {
    return [Number(node.text)];
  }

  if (ts.isParenthesizedExpression(node)) {
    return resolveNumberValues(node.expression, sourceFile, visited);
  }

  if (ts.isAsExpression(node)) {
    return resolveNumberValues(node.expression, sourceFile, visited);
  }

  if (ts.isSatisfiesExpression(node)) {
    return resolveNumberValues(node.expression, sourceFile, visited);
  }

  if (ts.isIdentifier(node)) {
    if (visited.has(node.text)) {
      return [];
    }

    const nextVisited = new Set(visited);
    nextVisited.add(node.text);

    const declaration = findVariableDeclaration(sourceFile, node.text);

    if (!declaration?.initializer) {
      return [];
    }

    return resolveNumberValues(
      declaration.initializer,
      sourceFile,
      nextVisited,
    );
  }

  if (ts.isConditionalExpression(node)) {
    return [
      ...new Set([
        ...resolveNumberValues(node.whenTrue, sourceFile, new Set(visited)),
        ...resolveNumberValues(node.whenFalse, sourceFile, new Set(visited)),
      ]),
    ];
  }

  return [];
}

function readStringAttribute(
  attributes: ts.JsxAttributes,
  name: string,
  sourceFile: ts.SourceFile,
): string[] {
  const attribute = attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) && property.name.getText(sourceFile) === name,
  );

  if (!attribute || !ts.isJsxAttribute(attribute)) {
    return [];
  }

  const initializer = attribute.initializer;

  if (!initializer) {
    return [];
  }

  if (ts.isStringLiteral(initializer)) {
    return [initializer.text];
  }

  if (ts.isJsxExpression(initializer) && initializer.expression) {
    return resolveStringValues(initializer.expression, sourceFile);
  }

  return [];
}

function readNumberAttribute(
  attributes: ts.JsxAttributes,
  name: string,
  sourceFile: ts.SourceFile,
): number[] {
  const attribute = attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) && property.name.getText(sourceFile) === name,
  );

  if (!attribute || !ts.isJsxAttribute(attribute)) {
    return [];
  }

  const initializer = attribute.initializer;

  if (!initializer) {
    return [];
  }

  if (ts.isStringLiteral(initializer)) {
    const value = Number(initializer.text);

    return Number.isFinite(value) ? [value] : [];
  }

  if (ts.isJsxExpression(initializer) && initializer.expression) {
    return resolveNumberValues(initializer.expression, sourceFile);
  }

  return [];
}

function collectIcons(sourceFile: ts.SourceFile): UsedIcon[] {
  const icons: UsedIcon[] = [];

  function visit(node: ts.Node) {
    let tagName: string | undefined;
    let attributes: ts.JsxAttributes | undefined;

    if (ts.isJsxSelfClosingElement(node)) {
      tagName = node.tagName.getText(sourceFile);
      attributes = node.attributes;
    } else if (ts.isJsxOpeningElement(node)) {
      tagName = node.tagName.getText(sourceFile);
      attributes = node.attributes;
    }

    if (tagName === "Icon" && attributes) {
      const names = readStringAttribute(attributes, "name", sourceFile);

      const explicitSizes = readNumberAttribute(attributes, "size", sourceFile);

      const sizes = explicitSizes.length > 0 ? explicitSizes : [DEFAULT_SIZE];

      for (const name of names) {
        for (const size of sizes) {
          icons.push({
            name,
            size,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return icons;
}

function readSvgData(svg: string): GeneratedIconData {
  const viewBoxMatch = svg.match(/\bviewBox=(["'])0 0 ([\d.]+) ([\d.]+)\1/i);

  if (!viewBoxMatch) {
    throw new Error(
      "Iconarium SVG must use a viewBox in the form '0 0 width height'.",
    );
  }

  const width = Number(viewBoxMatch[2]);

  const bodyMatch = svg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i);

  if (!bodyMatch) {
    throw new Error("Could not read Iconarium SVG body.");
  }

  return {
    width,
    path: bodyMatch[1].trim(),
  };
}

export async function generateUsedIconarium() {
  const files = await findTsxFiles(WEB_ROOT);
  const used = new Map<string, Set<number>>();
  const catalog = await collectAllIconariumIcons();

  for (const [name, sizes] of catalog) {
    used.set(name, new Set(sizes));
  }

  for (const file of files) {
    const contents = await readFile(file, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      contents,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    for (const icon of collectIcons(sourceFile)) {
      let sizes = used.get(icon.name);

      if (!sizes) {
        sizes = new Set<number>();
        used.set(icon.name, sizes);
      }

      sizes.add(icon.size);
    }
  }

  const generated: Record<string, Record<number, GeneratedIconData>> = {};

  for (const [name, sizes] of [...used.entries()].sort()) {
    generated[name] = {};

    for (const size of [...sizes].sort((a, b) => a - b)) {
      const svgPath = path.join(
        "packages",
        "iconarium",
        "icons",
        `${name}-${size}.svg`,
      );

      let svg: string;

      try {
        svg = await readFile(svgPath, "utf8");
      } catch {
        throw new Error(
          `Iconarium icon "${name}" does not support size ${size}.`,
        );
      }

      generated[name][size] = readSvgData(svg);
    }
  }

  const outputPath = path.join(WEB_ROOT, "generated", "iconarium.ts");

  await mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await writeFile(
    outputPath,
    `// Generated file. Do not edit.\n` +
      `// Contains only Iconarium icons referenced by the web application.\n\n` +
      `export const uiIcons = ${JSON.stringify(
        generated,
        null,
        2,
      )} as const;\n`,
    "utf8",
  );

  const variantCount = [...used.values()].reduce(
    (total, sizes) => total + sizes.size,
    0,
  );

  console.log(
    `Generated web Iconarium icons: ${used.size} icons, ${variantCount} variants`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateUsedIconarium();
}
