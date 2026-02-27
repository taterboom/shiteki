---
name: fix-issue
description: Fetch open GitHub issues for the current repo, let the user pick one, then implement the fix and create a PR.
---

# Fix GitHub Issue

When this skill is invoked:

## Step 1: Determine the repo

If an argument was provided (e.g. `/fix-issue owner/repo`), use that. Otherwise run:
```
gh repo view --json nameWithOwner -q .nameWithOwner
```
to get the current repo.

## Step 2: Fetch open issues

Run:
```
gh issue list --repo <owner/repo> --state open --limit 30 --json number,title,labels
```

Parse the JSON result. If there are no open issues, inform the user and stop.

## Step 3: Let the user pick an issue

Use `AskUserQuestion` with the issues as options (show `#number title`). Limit to at most 4 options in the UI — if there are more than 4, pick the 4 most recent, or ask the user to narrow down by passing a label/keyword as argument.

## Step 4: Fetch full issue details

Run:
```
gh issue view <number> --repo <owner/repo> --json number,title,body,labels,comments
```

Read and understand the issue: what needs to be changed, what's the expected behavior.

## Step 5: Implement the fix

- Explore the relevant code (use Glob, Grep, Read as needed)
- Create a new branch: `git checkout -b fix/issue-<number>`
- Implement the minimal fix that addresses the issue
- Do NOT over-engineer — match existing code style and patterns

## Step 6: Create a PR

After the fix:
1. Stage and commit the changes with a meaningful message referencing the issue (e.g. `fix: <title> (#<number>)`)
2. Push the branch
3. Create a PR:
```
gh pr create --title "fix: <issue title>" --body "Closes #<number>\n\n<brief description of what was changed>"
```
4. Output the PR URL to the user.
