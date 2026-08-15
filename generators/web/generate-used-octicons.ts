import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

interface OcticonHeightData {
  width: number;
  path: string;
}

interface OcticonData {
  heights: Record<string, OcticonHeightData>;
}

type OcticonsData = Record<string, OcticonData>;

interface UsedOcticon {
  name: string;
  size: number;
}

const WEB_ROOT = "apps/web";

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

function collectOcticons(sourceFile: ts.SourceFile): UsedOcticon[] {
  const icons: UsedOcticon[] = [];

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

    if (tagName === "Octicon" && attributes) {
      const names = readStringAttribute(attributes, "name", sourceFile);

      const sizes = readNumberAttribute(attributes, "size", sourceFile);

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

export async function generateUsedOcticons() {
  const files = await findTsxFiles(WEB_ROOT);

  const used = new Map<string, Set<number>>();

  for (const file of files) {
    const contents = await readFile(file, "utf8");

    const sourceFile = ts.createSourceFile(
      file,
      contents,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    for (const icon of collectOcticons(sourceFile)) {
      let sizes = used.get(icon.name);

      if (!sizes) {
        sizes = new Set<number>();
        used.set(icon.name, sizes);
      }

      sizes.add(icon.size);
    }
  }

  const dataPath = path.join(
    WEB_ROOT,
    "public",
    "packages",
    "octicons",
    "latest",
    "build",
    "data.json",
  );

  const octicons = JSON.parse(await readFile(dataPath, "utf8")) as OcticonsData;

  const generated: Record<string, Record<number, OcticonHeightData>> = {};

  for (const [name, sizes] of [...used.entries()].sort()) {
    const sourceIcon = octicons[name];

    if (!sourceIcon) {
      throw new Error(
        `Octicon "${name}" is used by the web app but does not exist.`,
      );
    }

    generated[name] = {};

    for (const size of [...sizes].sort((a, b) => a - b)) {
      const sourceSize = sourceIcon.heights[String(size)];

      if (!sourceSize) {
        throw new Error(`Octicon "${name}" does not support size ${size}.`);
      }

      generated[name][size] = {
        width: sourceSize.width,
        path: sourceSize.path,
      };
    }
  }

  const outputPath = path.join(WEB_ROOT, "generated", "octicons.ts");

  await mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await writeFile(
    outputPath,
    `// Generated file. Do not edit.\n` +
      `// Contains only Octicons referenced by the web application.\n\n` +
      `export const uiOcticons = ${JSON.stringify(
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
    `Generated web Octicons: ${used.size} icons, ${variantCount} variants`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateUsedOcticons();
}
