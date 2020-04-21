/* eslint-disable @typescript-eslint/no-var-requires,no-undef,@typescript-eslint/explicit-function-return-type */
const {readFileSync, writeFileSync} = require("fs");
const {join} = require("path");

const packageMeta = require("../package.json");

delete packageMeta.scripts;
delete packageMeta.devDependencies;

packageMeta.main = "index.js";

writeFileSync(
  join(__dirname, "../dist/package.json"),
  JSON.stringify(packageMeta, null, 2),
);

writeFileSync(
  join(__dirname, "../dist/.npmignore"),
  `*.js.map
`,
);

copyFileToDist("README.md");
copyFileToDist("LICENSE");

function copyFileToDist(fileName) {
  writeFileSync(
    join(__dirname, "../dist", fileName),
    readFileSync(join(__dirname, "..", fileName)),
  );
}
