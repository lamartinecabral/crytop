// @ts-check
const fs = require("fs");
const { argv } = require("process");
const capitalizeFirst = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

const umdfile = argv[2];
const umdname = capitalizeFirst(umdfile.split("/").pop()?.split(".")[0]);

const script = fs.readFileSync(umdfile).toString();

const searchLine = `})(function (require, exports) {`;
const replaceValue = `    else { factory(null, globalThis.${umdname} = {}); }\n${searchLine}`;
const fixedScript = script.replace(searchLine, replaceValue);

fs.writeFileSync(umdfile, fixedScript);
