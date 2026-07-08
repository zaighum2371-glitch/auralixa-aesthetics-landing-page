# GitHub Issues & Workflow Guide for AI Development Agents

This document defines the strict, disciplined workflow that all AI development agents must follow when working on the **auralixa-aesthetics-landing-page** project. It ensures full traceability, clear milestone tracking, and clean communication with the human developer.

---

## Core Philosophy

1. **No Untracked Work**: Every change, feature, bug fix, or refactor must be mapped to a GitHub issue.
2. **Real-time Synchronization**: The state of GitHub issues and milestones must accurately reflect the agent's current state of work.
3. **Proactive Communication**: Any technical decisions, roadblocks, or design changes must be documented directly in the comments of the corresponding issue.

---

## Agent Step-by-Step Workflow

Whenever a new chat session begins or a new task is received, the agent must follow this 4-step workflow:

### Step 1: Context Verification & Search
1. **Authenticate**: Call `get_me` to verify permissions and identify the active user context.
2. **Search Existing Issues**: Run `search_issues` or `list_issues` to see if there is an existing issue matching the current task. Do not create duplicates.
3. **Read Current State**: If an issue exists, read it fully using `issue_read` along with any existing comments to understand the context.

### Step 2: Planning & Setup
If no issue exists for the assigned task, or if you are breaking a large task into sub-tasks:
1. **Create an Issue**: Use `issue_write` with `method: "create"`.
   - **Title**: Use a concise, action-oriented title (e.g., `feat: Integrate Tailwind CSS custom palette` or `fix: Mobile navigation transition jitter`).
   - **Body**: Structure it using the standard **Issue Template** (see below).
   - **Assignees**: Assign it to the current user (obtained from `get_me`).
   - **Milestone**: Assign the issue to the active project milestone (if applicable).
   - **Labels**: Apply relevant labels (e.g., `bug`, `feature`, `enhancement`, `documentation`, `design`).

### Step 3: Execution & Updates
While the work is in progress:
1. **Acknowledge Start**: Post a comment on the issue stating that work has started (e.g., *"Starting implementation. I will focus on components X and Y first."*).
2. **Document Blockers/Decisions**: If you encounter a design decision or a blocking issue, pause and write a detailed comment on the issue detailing the options and trade-offs.
3. **Task Checklists**: Keep the checklists in the issue body updated. If you complete a sub-task, update the issue body to check it off.

### Step 4: Verification & Closure
When the work is complete and verified:
1. **Summarize Work**: Add a final comment to the issue summarizing the changes, files modified, and how you verified them (e.g., unit tests run, visual checks performed).
2. **Link Deliverables**: Mention the Pull Request or key commits in the final comment.
3. **Close the Issue**: Call `issue_write` with:
   - `method: "update"`
   - `state: "closed"`
   - `state_reason: "completed"`

---

## Issue Body Template

When creating a new issue, use the following Markdown structure for the body:

```markdown
## Goal / User Story
A clear, concise description of what needs to be achieved and why.

## Implementation Plan
- Brief technical approach or architectural details.
- List of files to create, modify, or delete.

## Tasks / Acceptance Criteria
- [ ] Task 1: Foundation setup
- [ ] Task 2: Core component implementation
- [ ] Task 3: Visual styling and responsive testing
- [ ] Task 4: Automated/Manual verification

## Verification Plan
- How will the changes be validated (e.g., `npm run test`, manual visual inspection in browser)?
```

---

## GitHub MCP Server Tool Checklist

Here are the precise tools you should use to manage issues and milestones:

| Tool | Action | Example Use Case |
| :--- | :--- | :--- |
| `get_me` | Read | Call first to verify username and permissions. |
| `search_issues` | Read | Search for keywords to avoid creating duplicate issues. |
| `list_issues` | Read | Retrieve a paginated list of issues for the repository. |
| `issue_read` | Read | Get detailed content, labels, comments, and milestones for a specific issue. |
| `issue_write` | Write | Use with `method: "create"` to open an issue or `method: "update"` to edit/close. |
| `add_issue_comment` | Write | Add updates, ask questions, or document design decisions. |

---

## 4. Standard Labels

Apply these labels when creating issues:
- `enhancement`: New features or improvements.
- `bug`: Errors or broken functionality.
- `documentation`: Changes to README, guides, or code comments.
- `refactor`: Code cleanup without logic change.
- `urgent`: Blocks critical workflows.

---

## Best Practices & Discipline Rules

* **Always Set state_reason**: When closing an issue, always specify `state_reason: "completed"` (or `not_planned`/`duplicate` where appropriate).
* **Self-Containment**: Do not assume the human remembers previous chat context. Let the GitHub issue serve as the "source of truth" for the task's state.
* **Keep Milestones Active**: Ensure that all issues are associated with their correct project milestone to maintain a high-level view of progress.
