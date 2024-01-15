# github-kanban-action

This action automatically generates a static HTML page for your GitHub projects. There are two requirements:

1. It only works with new GitHub projects.
2. It only works with user projects (not organization ones just yet).

## Inputs

### `project-url`

**Required** The URL of your project (i.e. `https://github.com/users/Serchinastico/projects/7`)

## Example usage

```yaml
uses: actions/github-kanban-action
with:
  project-url: "https://github.com/users/Serchinastico/projects/7"
```
