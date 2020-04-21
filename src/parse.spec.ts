import {parseComments, parseImports, parseMacroFromComment} from "./parse";

describe("parseImports", () => {
  it("parses the imports", () => {
    expect(
      parseImports(
        `
# import TEST1
#import   TEST2  

type A {
  b #import TEST3
}
`,
        [(macro) => ({from: macro, imports: null})],
      ),
    ).toEqual([
      {from: "TEST1", imports: null},
      {from: "TEST2", imports: null},
      {from: "TEST3", imports: null},
    ]);
  });

  it("errors on invalid macro", () => {
    expect(() =>
      parseImports(
        `
# import TEST1
#import   TEST2  

type A {
  b
}
`,
        [(macro) => (macro === "TEST1" ? {from: macro, imports: null} : null)],
      ),
    ).toThrowError("invalid import");
  });
});

describe("parseComments", () => {
  it("parses comments", () => {
    expect(
      parseComments(
        `# i am a comment as the start
# i am a comment
type a { # i am an inline comment
  # i am an odd comment\r
# i am a comment at the end`,
      ),
    ).toEqual([
      " i am a comment as the start",
      " i am a comment",
      " i am an inline comment",
      " i am an odd comment",
      " i am a comment at the end",
    ]);
  });

  it("does not strip whitespace", () => {
    expect(parseComments("#    i am a comment    ")?.[0]).toEqual(
      "    i am a comment    ",
    );
  });

  it("does not match when no comments", () => {
    expect(parseComments("")).toEqual([]);
    expect(parseComments("type a {\n")).toEqual([]);
  });
});

describe("parseMacroFromComment", () => {
  it("matches comments", () => {
    expect(parseMacroFromComment("import TEST")).toEqual("TEST");
  });

  it("strips whitespace", () => {
    expect(parseMacroFromComment("  import   TEST   ")).toEqual("TEST");
  });

  it("does not match when not import", () => {
    expect(parseMacroFromComment("impo something els")).toEqual(undefined);
  });
});
