import {Import, Matcher} from "./matchers";
import {isDefined} from "./utils";

export function parseImports<T>(
  body: string,
  matchers: Matcher<T>[],
): Import<T>[] {
  return parseComments(body)
    .map(parseMacroFromComment)
    .filter(isDefined)
    .map(buildParseMacro(matchers));
}

// Comments : https://spec.graphql.org/June2018/#sec-Comments
const COMMENT_MATCHER = new RegExp(
  String.raw`#` + // start of comment
  String.raw`(.+)` + // comment content
    String.raw`(?:\n|\r(?!\n)|\r\n|$)`, // https://spec.graphql.org/June2018/#sec-Line-Terminators
  "g",
);

export function parseComments(body: string): string[] {
  return Array.from(matchAll(body, COMMENT_MATCHER)).map(
    ([, comment]) => comment,
  );
}

function* matchAll(content: string, matcher: RegExp): Iterable<string[]> {
  const clone = new RegExp(
    matcher.source,
    matcher.flags.replace("g", "") + "g",
  );

  let match: string[] | null;
  while ((match = clone.exec(content))) {
    yield match;
  }
}

const IMPORT_MACRO_MATCHER = /\s*import\s+(.+?)\s*$/;

export function parseMacroFromComment(comment: string): string | undefined {
  const match = comment.match(IMPORT_MACRO_MATCHER);

  return match ? match[1] : undefined;
}

function buildParseMacro<T>(
  matchers: Matcher<T>[],
): (macro: string) => Import<T> {
  return (macro) => {
    const matchOrImport = matchers.reduce<string | Import<T>>(
      matcherReducer,
      macro,
    );

    if (typeof matchOrImport === "string") {
      throw new Error(`invalid import: \`import ${macro}\``);
    } else {
      return matchOrImport;
    }
  };
}

function matcherReducer<T>(
  acc: Import<T> | string,
  matcher: Matcher<T>,
): Import<T> | string {
  if (typeof acc === "string") {
    const match = matcher(acc);

    if (match) {
      return match;
    }
  }

  return acc;
}
