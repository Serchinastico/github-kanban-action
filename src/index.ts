import { Command, OptionValues } from "commander";
import exec from "exec-sh";
import figlet from "figlet";
import "dotenv/config";

const execSh = exec.promise;

const create = async () => {};

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

program.option("-d, --debug", "Prints debug information").parse(process.argv);
