import { Command, OptionValues } from "commander";
import exec from "exec-sh";
import figlet from "figlet";
import "dotenv/config";
import ejs from "ejs";
import fs from "fs";

const create = async (username: string, projectId: string) => {
  const { output: outFile } = program.opts();

  const template = fs.readFileSync("template/index.ejs.html", "utf-8");
  const contents = ejs.render(template, {});

  if (outFile) {
    fs.writeFileSync(outFile, contents);
  } else {
    console.log(contents);
  }
};

const program = new Command();

console.log(figlet.textSync("GHKB", "Colossal"));

program
  .name("ghkb")
  .version("1.0.0")
  .description(
    "Script to generate a static HTML Kanban view from a GitHub project"
  )
  .command("create")
  .argument("<username>", "The GitHub username of the owner of the project")
  .argument("<project id>", "The project id (usually a number)")
  .action(create);

program
  .option("-d, --debug", "Prints debug information")
  .option("-o, --output <file>", "Output HTML file")
  .parse(process.argv);
