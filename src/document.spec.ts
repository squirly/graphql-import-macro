import {parse, Source} from "graphql/language";
import {processDocumentImports} from "./document";

describe("processDocumentImports", () => {
  it("throws with no source", async () => {
    const ast = parse("{ a }");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ast as any).loc = undefined;

    await expect(processDocumentImports(ast)).rejects.toThrow(
      "DocumentNode mush have a loc. It should be created with `new Source(body, filePath)`.",
    );
  });

  it("throws with no source", async () => {
    await expect(processDocumentImports(parse("{ a }"))).rejects.toThrow(
      "DocumentNode was not created with an explicit path. It should be created with `new Source(body, filePath)`.",
    );
  });

  it("throws with invalid definitions", async () => {
    await expect(
      processDocumentImports(
        parse(new Source("type A { a: String }", "/my/test/path.graphql")),
      ),
    ).rejects.toThrow(
      "Only executable definitions are supported in GraphQL Documents." +
        `\nFile: /my/test/path.graphql` +
        "\nSee http://spec.graphql.org/June2018/#sec-Documents",
    );
  });
});
