import {DocumentNode} from "graphql";

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function ensureSource(
  document: DocumentNode,
): {filePath: string; body: string} {
  if (document.loc === undefined) {
    throw new Error(
      "DocumentNode mush have a loc. It should be created with `new Source(body, filePath)`.",
    );
  }

  if (document.loc.source.name === "GraphQL request") {
    throw new Error(
      "DocumentNode was not created with an explicit path. It should be created with `new Source(body, filePath)`.",
    );
  }

  return {
    filePath: document.loc.source.name,
    body: document.loc.source.body.slice(document.loc.start, document.loc.end),
  };
}
