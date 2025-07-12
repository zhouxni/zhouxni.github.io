const { src, series } = require("gulp");
const path = require("path");
const fs = require("fs");
const filePaths = [
  "/",
  "/index.html",
  "/css/github-markdown.min.css",
  "/css/github.min.css",
  "/css/uikit.min.css",
  "/js/highlight.min.js",
  "/js/jquery.min.js",
  "/js/markdown-it.min.js",
];
function listFiles() {
  return src("./html/**/*.*").on("data", (file) => {
    const relativePath = path.join("/", path.relative("./", file.path));
    filePaths.push(relativePath);
  });
}

function updateWroker(done) {
  const swPath = path.join(__dirname, "serviceWorker.js");
  let swContent = fs.readFileSync(swPath, "utf8");
  const newUrlsToCache = `const urlsToCache = ${JSON.stringify(filePaths)}`;
  // 终极正则（适配所有格式变体）
  swContent = swContent.replace("const urlsToCache = []", newUrlsToCache);
  fs.writeFileSync(swPath, swContent, "utf8");
  done();
}

exports.default = series(listFiles, updateWroker);
