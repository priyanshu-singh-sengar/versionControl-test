# Contributing to versionControl-test

Thank you for contributing! Please follow these guidelines to keep the workflow smooth and the commit history clean.

## Workflow

1. **Check for an existing issue** — browse [Issues](https://github.com/priyanshu-singh-sengar/versionControl-test/issues) before starting work.
2. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/<short-description>
   ```
3. **Make focused commits** with clear, descriptive messages.
4. **Push your branch** and open a Pull Request:
   ```bash
   git push origin feature/<short-description>
   ```
5. **Link the PR to the related issue** using keywords like `Closes #<issue-number>` in the PR description.
6. **Request a review** — at least 1 approval is required before merging.
7. **Merge via squash merge** to keep a clean, linear history on `main`.

## Branch Naming

| Type      | Pattern                        | Example                       |
|-----------|--------------------------------|-------------------------------|
| Feature   | `feature/<short-description>`  | `feature/add-login-page`      |
| Bugfix    | `bugfix/<short-description>`   | `bugfix/fix-null-pointer`     |
| Hotfix    | `hotfix/<short-description>`   | `hotfix/patch-auth-bypass`    |

## Commit Messages

Use clear, imperative-mood commit messages:

```
feat: add user authentication module
fix: resolve null reference in parser
docs: update README with setup instructions
```

## Code Review

- Every PR requires at least **1 approving review**.
- Address all review comments before merging.
- Keep PRs small and focused on a single concern.
