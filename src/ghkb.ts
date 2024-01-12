import "dotenv/config";
import ejs from "ejs";
import fs from "fs";
import { graphql } from "@octokit/graphql";
import {
  ProjectV2ItemFieldLabelValue,
  ProjectV2ItemFieldSingleSelectValue,
  ProjectV2SingleSelectField,
  User,
} from "@octokit/graphql-schema";
import assert from "assert";
import Color from "color";
import { Issue, Label, Project, Status } from "./domain";

interface Props {
  username: string;
  projectId: string;
  outFile: string;
}

export const createKanbanPage = async ({
  username,
  projectId,
  outFile,
}: Props) => {
  const template = fs.readFileSync("template/index.ejs.html", "utf-8");

  const { user } = await graphql<{ user: User }>(
    `
        {
          user(login: "${username}") {
            projectV2 (number: ${projectId}) {
              title
              shortDescription
              field(name: "Status") {
                ... on ProjectV2SingleSelectField {
                  name
                  options {
                    id
                    name
                  }
                }
              }
              items(first: 50) {
                nodes {
                  content {
                    __typename
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
                  fieldValueByName(name: "Status") {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                  
                  fieldValues(first: 50) {
                    nodes {
                      __typename
                      ... on ProjectV2ItemFieldLabelValue {
                        labels(first: 50) {
                          nodes {
                            color
                            name
                          }
                        }
                      }
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

  assert(user.projectV2?.items.nodes);

  const statusField = user.projectV2.field as ProjectV2SingleSelectField;
  const status: Status[] = statusField.options
    .map((option) => option.name)
    .map((name) => ({ name, issues: [] }));

  for (const issue of user.projectV2.items.nodes) {
    assert(issue);
    assert(issue.content);

    const fieldValue =
      issue.fieldValueByName as ProjectV2ItemFieldSingleSelectValue;
    const statusName = fieldValue.name!;
    const title = issue.content.title;
    const labels: Label[] = issue.fieldValues
      .nodes!.filter(
        (fvNode) => fvNode!.__typename === "ProjectV2ItemFieldLabelValue"
      )
      .map((fvNode) => fvNode! as ProjectV2ItemFieldLabelValue)
      .map((fvNode) => fvNode.labels!.nodes!)
      .flat()
      .map((lNode) => ({
        name: lNode!.name,
        color: lNode!.color,
        isDarkColor: Color(`#${lNode!.color}`).isDark(),
      }));

    const parsedIssue: Issue = { title, labels };
    status.find((st) => st.name === statusName)?.issues.push(parsedIssue);
  }

  const project: Project = { name: user.projectV2.title, status };

  const contents = ejs.render(template, {
    title: user.projectV2?.title,
    description: user.projectV2?.shortDescription,
    project,
  });

  if (outFile) {
    fs.writeFileSync(outFile, contents);
  } else {
    console.log(contents);
  }
};
