# github-kanban-action

This action automatically generates a static HTML page for your GitHub projects.

## Inputs

### `username`

**Required** The username that created the project. In my case it'd be `Serchinastico`.

### `projectId`

**Required** The project id, usually a number. If you want to know your own project id, just visit your project and extract it from the URL (e.g. For https://github.com/users/Serchinastico/projects/7, the `projectId` is `7`).

## Example usage

```yaml
uses: actions/github-kanban-action
with:
  username: "Serchinastico"
  projectId: "7"
```
