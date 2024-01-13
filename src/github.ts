import { getInput, info, setFailed } from "@actions/core";
import { getOctokit } from "@actions/github";
import { createKanbanPage } from "./ghkb";

/**
 * These variables are automatically set when packaging the action.
 * Do not bother editing them as their value will be replaced.
 *
 * If you change their names, then update the corresponding references in
 * the embedAssets.ts script.
 */
const HTML_TEMPLATE_CONTENTS = ``;
const CSS_CONTENTS = ``;

try {
  const projectUrl = getInput("project-url");
  const token = getInput("token");
  const outFile = getInput("out-html-file");

  const matches = projectUrl.match(
    /github\.com\/users\/(\w+)\/projects\/(\d+)/
  )!;
  const username = matches[1];
  const projectId = matches[2];

  info(
    `Extracted username (${username}) and project id (${projectId}) from project-url`
  );

  createKanbanPage({
    username,
    projectId,
    outFile,
    overrides: {
      graphql: getOctokit(token).graphql,
      htmlTemplateContents: HTML_TEMPLATE_CONTENTS,
      style: CSS_CONTENTS,
    },
  });
} catch (error: any) {
  setFailed(error.message);
}
