const fs = require("fs");
let path = "./node_modules/node-web-audio-api/package.json";
let data;
async function read() {
return new Promise((resolve) => {
fs.readFile(path, "utf8", (err, d) => {
  if (err) {
    console.error(err);
  }
  data = JSON.parse(d);
  resolve();
});
});
}
async function write() {
return new Promise((resolve) => {
fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error(err);
  }
  resolve();
});
});
}
async function main() {
    await read();
    data["main"] = "./index.cjs";
    await write();
}
main();