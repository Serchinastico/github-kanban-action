import { Command } from "commander";
import figlet from "figlet";
import "dotenv/config";
import { createKanbanPage } from "./ghkb";

console.log(figlet.textSync("GHKB", "Colossal"));

const program = new Command();

program
  .name("ghkb")
  .version("1.0.0")
  .description(
    "Script to generate a static HTML Kanban view from a GitHub project"
  );

program
  .command("create")
  .argument("<username>", "The GitHub username of the owner of the project")
  .argument("<project id>", "The project id (number)")
  .action((username, projectId) => {
    const { output: outFile } = program.opts();

    createKanbanPage({ username, projectId, outFile });
  });

program
  .option("-d, --debug", "Prints debug information")
  .option("-o, --output <file>", "Output HTML file", "out/index.html")
  .parse(process.argv);
