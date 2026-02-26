- [ ] claude code plugin: 从 repo 中拉取 issue/kanban task，coding 完成后提交 pr 关掉 issue/kanban task。

- GitHub Action auto issue killer

# .github/workflows/shiteki-claude.yml
name: Handle Shiteki Feedback
on:
  issues:
    types: [opened]

jobs:
  fix:
    if: contains(github.event.issue.labels.*.name, 'shiteki') || contains(github.event.issue.labels.*.name, 'feedback')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Read the GitHub Issue below and implement the requested changes.
            The issue was created by the Shiteki annotation tool — it contains
            element selectors, screenshots, and user comments describing UI feedback.
            Create a PR with the fixes.

            Issue: ${{ github.event.issue.title }}
            Body: ${{ github.event.issue.body }}
工作流程：

用户在页面上标注问题 → 按 S 发送
Shiteki 自动创建带 label 的 GitHub Issue
GitHub Action 被触发，Claude Code 读取 Issue 内容
Claude Code 自动修改代码并创建 PR