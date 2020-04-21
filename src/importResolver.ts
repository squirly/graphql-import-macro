import {DocumentNode, parse, Source} from "graphql/language";

export type ImportResolver = (
  from: string,
  to: string,
) => Promise<DocumentNode>;

export const defaultImportResolver: ImportResolver = async (from, to) => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const {readFile} = require("fs");
  const {dirname, join} = require("path");
  const {promisify} = require("util");
  /* eslint-enable @typescript-eslint/no-var-requires */

  const filePath = join(dirname(from), to);

  const body = await promisify(readFile)(filePath, {encoding: "utf-8"});

  const source = new Source(body, filePath);

  return parse(source);
};
