import core from "@actions/core";
import { createKanbanPage } from "./ghkb";

try {
  const projectUrl = core.getInput("project-url");

  const matches = projectUrl.match(
    /github\.com\/users\/(\w+)\/projects\/(\d+)/
  )!;
  const username = matches[1];
  const projectId = matches[2];

  createKanbanPage({ username, projectId, outFile: "out" });
} catch (error: any) {
  core.setFailed(error.message);
}
