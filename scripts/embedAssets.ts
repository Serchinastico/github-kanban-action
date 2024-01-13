import fs from "fs/promises";
import fssync from "fs";

const TEMPLATE_DIRECTORY = "template";
const IN_DIRECTORY = "src";
const TMP_DIRECTORY = "tmp";
const OUT_DIRECTORY = "out";

const GITHUB_FILE = "github.ts";
const HTML_TEMPLATE_FILE = "index.ejs.html";
const STYLE_FILE = "styles.css";

const main = async () => {
  if (!fssync.existsSync(TMP_DIRECTORY)) {
    await fs.mkdir(TMP_DIRECTORY);
  }

  await fs.cp(IN_DIRECTORY, TMP_DIRECTORY, { recursive: true });

  let contents = await fs.readFile(`${TMP_DIRECTORY}/${GITHUB_FILE}`, {
    encoding: "utf-8",
  });
  const htmlContents = await fs.readFile(
    `${TEMPLATE_DIRECTORY}/${HTML_TEMPLATE_FILE}`,
    { encoding: "utf-8" }
  );
  const cssContents = await fs.readFile(`${OUT_DIRECTORY}/${STYLE_FILE}`, {
    encoding: "utf-8",
  });

  const normalizedCssContents = cssContents.replace("\\", "\\\\");

  const fileWithReplacements = contents
    .replace(
      `const HTML_TEMPLATE_CONTENTS = \``,
      `const HTML_TEMPLATE_CONTENTS = \`${htmlContents}`
    )
    .replace(
      `const CSS_CONTENTS = \``,
      `const CSS_CONTENTS = \`${normalizedCssContents}`
    );

  await fs.writeFile(`${TMP_DIRECTORY}/${GITHUB_FILE}`, fileWithReplacements, {
    encoding: "utf-8",
  });
};

main();
