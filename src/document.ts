import {isExecutableDefinitionNode, DocumentNode} from "graphql/language";
import {expandDocumentImports} from "./expander";
import {defaultImportResolver, ImportResolver} from "./importResolver";
import {Import, IMPORT_ALL} from "./matchers";
import {parseImports} from "./parse";
import * as matchers from "./matchers";
import {ensureSource} from "./utils";

/**
 * Parse and expand all imports, recursively
 */
export async function processDocumentImports(
  document: DocumentNode,
  loadImport: ImportResolver = defaultImportResolver,
): Promise<DocumentNode> {
  const {filePath} = ensureSource(document);

  const resolvedImports = await Promise.all(
    parseDocumentImports(document).map(async ({imports, from: to}) => ({
      imports,
      document: await processDocumentImports(
        await loadImport(filePath, to),
        loadImport,
      ),
    })),
  );

  return expandDocumentImports(document, resolvedImports);
}

export function parseDocumentImports(
  document: DocumentNode,
): Import<IMPORT_ALL | string[]>[] {
  const {filePath, body} = ensureSource(document);

  const invalidDefinitions = document.definitions.filter(
    (d) => !isExecutableDefinitionNode(d),
  );

  if (invalidDefinitions.length > 0) {
    throw new Error(
      "Only executable definitions are supported in GraphQL Documents." +
        `\nFile: ${filePath}` +
        "\nSee http://spec.graphql.org/June2018/#sec-Documents",
    );
  }

  return parseImports<IMPORT_ALL | string[]>(body, documentImportMatchers);
}

const documentImportMatchers = [
  matchers.importAll,
  matchers.importAllExplicit,
  matchers.importNamed,
];
