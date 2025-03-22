'use strict';
const fs = require('fs');
const path = require('path');
const { minify } = require("terser")
const ROOT_PATH = path.join(__dirname, './dist');
function readFileList (currentPath) {
  const files = fs.readdirSync(currentPath);
  files.forEach(async file => {
    const childPath = path.join(currentPath, file);
    const stat = fs.statSync(childPath);
    if (stat.isDirectory()) {
        readFileList(childPath);
      } else {
      if (file.endsWith('.js')) {
        const {code} = await minify(
          fs.readFileSync(childPath, "utf8"),
          {
            compress: false,
            mangle: true,
            toplevel: true,
          }
        )
        fs.writeFileSync(
          childPath,
          code,
        );
      }
    }
  })
}
readFileList(ROOT_PATH);
