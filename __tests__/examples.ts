import {print} from "graphql";
import {processDocumentImports, resolver} from "../src";

describe("integration", () => {
  it("runs 1", async () => {
    expect(
      print(
        await processDocumentImports(
          await resolver(__filename, "../examples/1/MyQuery.graphql"),
          resolver,
        ),
      ),
    ).toEqual(
      print(await resolver(__filename, "../examples/1/result.graphql")),
    );
  });
});
