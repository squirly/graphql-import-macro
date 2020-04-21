export type Matcher<T> = (macro: string) => Import<T> | null;

export type Import<T> = {
  from: string;
  imports: T;
};

const PATH_REGEX = String.raw`(?:'(.+)'|"(.+)")`;

export const IMPORT_ALL = "ALL";
export type IMPORT_ALL = typeof IMPORT_ALL;

// import 'path.graphql'
export const IMPORT_ALL_MATCHER = new RegExp(
  String.raw`^` + // START: Match entire string
  PATH_REGEX + // Path Component
    String.raw`$`, // END: Match entire string
);

export const importAll: Matcher<IMPORT_ALL> = (macro: string) => {
  const match = macro.match(IMPORT_ALL_MATCHER);

  return match
    ? {
        from: filePathFromMatch(match),
        imports: IMPORT_ALL,
      }
    : null;
};

// import * from 'path.graphql'
export const IMPORT_ALL_EXPLICIT_MATCHER = new RegExp(
  String.raw`^` + // START: Match entire string
  String.raw`\*\s+from\s+` + // `* from `
  PATH_REGEX + // Path Component
    String.raw`$`, // END: Match entire string
);

export const importAllExplicit: Matcher<IMPORT_ALL> = (macro: string) => {
  const match = macro.match(IMPORT_ALL_EXPLICIT_MATCHER);

  return match
    ? {
        from: filePathFromMatch(match),
        imports: IMPORT_ALL,
      }
    : null;
};

// Names : https://spec.graphql.org/June2018/#sec-Names
const NAME_REGEX = String.raw`[_A-Za-z][_0-9A-Za-z]*`;

// import A, B from 'path.graphql'
export const IMPORT_NAMED_MATCHER = new RegExp(
  String.raw`^` + // START: Match entire string
  String.raw`(` + // START: Match names
  String.raw`(?:${NAME_REGEX}\s*,\s*)*` + // list of names
  NAME_REGEX + // name
  String.raw`)` + // END: Match names
  String.raw`\s+from\s+` + // ` from `
  PATH_REGEX + // Path Component
    String.raw`$`, // END: Match entire string
);

export const importNamed: Matcher<string[]> = (macro: string) => {
  const match = macro.match(IMPORT_NAMED_MATCHER);

  return match
    ? {
        from: filePathFromMatch(match),
        imports: match[1].split(",").map((name) => name.trim()),
      }
    : null;
};

function filePathFromMatch(match: string[]): string {
  const filePathMatches = match.slice(-2);

  return filePathMatches[0] || filePathMatches[1];
}
