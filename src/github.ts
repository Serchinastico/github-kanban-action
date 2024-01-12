import core from "@actions/core";
import github from "@actions/github";
import { createKanbanPage } from "./ghkb";

try {
  const username = core.getInput("username");
  const projectId = core.getInput("projectId");

  createKanbanPage({ username, projectId, outFile: "out" });
} catch (error: any) {
  core.setFailed(error.message);
}
