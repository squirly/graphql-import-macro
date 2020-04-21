import {importAll, importAllExplicit, importNamed} from "./matchers";

describe("matchers", () => {
  describe("importAll", () => {
    it("parses valid imports", () => {
      expect(importAll('"./my_file_path.graphql"')).toEqual({
        from: "./my_file_path.graphql",
        imports: "ALL",
      });
      expect(importAll("'some_path.graphql'")).toEqual({
        from: "some_path.graphql",
        imports: "ALL",
      });
      expect(importAll('"../../../folder/some_path.graphql"')).toEqual({
        from: "../../../folder/some_path.graphql",
        imports: "ALL",
      });
    });

    it("returns undefined on invalid imports", () => {
      expect(importAll("./some_path.graphql")).toBe(null);
      expect(importAll('* from "./some_path.graphql"')).toBe(null);
    });
  });

  describe("importAllExplicit", () => {
    it("parses valid imports", () => {
      expect(importAllExplicit('* from "./my_file_path.graphql"')).toEqual({
        from: "./my_file_path.graphql",
        imports: "ALL",
      });
      expect(importAllExplicit("* from 'some_path.graphql'")).toEqual({
        from: "some_path.graphql",
        imports: "ALL",
      });
      expect(
        importAllExplicit('* from "../../../folder/some_path.graphql"'),
      ).toEqual({
        from: "../../../folder/some_path.graphql",
        imports: "ALL",
      });
    });

    it("allows internal whitespace", () => {
      expect(importAllExplicit('*   from    "./my_file_path.graphql"')).toEqual(
        {
          from: "./my_file_path.graphql",
          imports: "ALL",
        },
      );
    });

    it("returns undefined on invalid imports", () => {
      expect(importAllExplicit("'./some_path.graphql'")).toBe(null);
      expect(importAllExplicit("* from ./some_path.graphql")).toBe(null);
      expect(importAllExplicit('N from "./some_path.graphql"')).toBe(null);
    });
  });

  describe("importNamed", () => {
    it("parses valid imports", () => {
      expect(importNamed('N from "./my_file_path.graphql"')).toEqual({
        from: "./my_file_path.graphql",
        imports: ["N"],
      });
    });
    it("parses valid imports", () => {
      expect(importNamed('Name from "./my_file_path.graphql"')).toEqual({
        from: "./my_file_path.graphql",
        imports: ["Name"],
      });
      expect(importNamed("Two, Imports from 'some_path.graphql'")).toEqual({
        from: "some_path.graphql",
        imports: ["Two", "Imports"],
      });
      expect(
        importNamed("Multiple, Imported, Things from 'some_path.graphql'"),
      ).toEqual({
        from: "some_path.graphql",
        imports: ["Multiple", "Imported", "Things"],
      });
    });

    it("ignores internal whitespace", () => {
      expect(
        importNamed(
          'Multiple  ,  Imported,Things    from "./my_file_path.graphql"',
        ),
      ).toEqual({
        from: "./my_file_path.graphql",
        imports: ["Multiple", "Imported", "Things"],
      });
      expect(
        importNamed("Multiple, Imported, Things from 'some_path.graphql'"),
      ).toEqual({
        from: "some_path.graphql",
        imports: ["Multiple", "Imported", "Things"],
      });
    });

    it("returns undefined on invalid imports", () => {
      expect(importNamed("'./some_path.graphql'")).toBe(null);
      expect(importNamed('* from "./some_path.graphql"')).toBe(null);
      expect(importNamed("A from ./some_path.graphql")).toBe(null);
      expect(importNamed("Imp, 1Test from ./some_path.graphql")).toBe(null);
    });
  });
});
