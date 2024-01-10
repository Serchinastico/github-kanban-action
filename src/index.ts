import { Command } from "commander";
import figlet from "figlet";
import "dotenv/config";
import ejs from "ejs";
import fs from "fs";
import { graphql } from "@octokit/graphql";
import { User } from "@octokit/graphql-schema";

const create = async (username: string, projectId: string) => {
  const { output: outFile } = program.opts();

  const template = fs.readFileSync("template/index.ejs.html", "utf-8");

  const { user } = await graphql<{ user: User }>(
    `
      {
        user(login: "${username}") {
          projectV2 (number: ${projectId}) {
            title
            shortDescription
            items(first: 50) {
              nodes {
                content {
                  ... on DraftIssue {
                    id
                    title
                  }
                  ... on Issue {
                    id
                    title
                    url
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token ${process.env.GH_TOKEN}`,
      },
    }
  );

  const contents = ejs.render(template, {
    title: user.projectV2?.title,
    description: user.projectV2?.shortDescription,
  });

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
  .argument("<project id>", "The project id (number)")
  .action(create);

program
  .option("-d, --debug", "Prints debug information")
  .option("-o, --output <file>", "Output HTML file", "out/index.html")
  .parse(process.argv);
