import {DefinitionNode, DocumentNode, NameNode, visit} from "graphql/language";
import {IMPORT_ALL} from "./matchers";

export function expandDocumentImports(
  document: DocumentNode,
  imports: ResolvedImport<IMPORT_ALL | string[]>[],
): DocumentNode {
  return {
    ...document,
    definitions: imports.reduce<readonly DefinitionNode[]>(
      (acc, importMeta) =>
        acc.concat(
          importMeta.imports === IMPORT_ALL
            ? importMeta.document.definitions
            : getImportedAstNodes(importMeta.imports, importMeta.document),
        ),
      document.definitions,
    ),
  };
}

export type ResolvedImport<T> = {
  document: DocumentNode;
  imports: T;
};

export function getImportedAstNodes(
  imports: string[],
  document: DocumentNode,
): DefinitionNode[] {
  const importNames = new Set(imports);

  const namedDefinitionNodes = document.definitions.filter(isNamedNode);

  const requiredNames = new Set(
    namedDefinitionNodes
      .filter(({name}) => importNames.has(name.value))
      // flatMap
      .reduce<string[]>(
        (acc, definition) => [
          ...acc,
          definition.name.value,
          ...getOperationNodeDependencyNames(definition),
        ],
        [],
      ),
  );

  return namedDefinitionNodes.filter((definition) =>
    requiredNames.has(definition.name.value),
  );
}

function getOperationNodeDependencyNames(node: DefinitionNode): string[] {
  const names = new Set<string>();

  visit(node, {
    FragmentSpread({name}) {
      names.add(name.value);
    },
  });

  return Array.from(names);
}

type NamedNode<T> = T & {name: NameNode};
function isNamedNode(node: DefinitionNode): node is NamedNode<DefinitionNode> {
  return "name" in node && node.name !== undefined;
}
