# GitHub Actions Setup Guide

## Setting Up CI/CD for Agent Evals

### 1. Add GitHub Secrets

Navigate to your repository settings:

```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

Add the following secret:

| Name | Value | Description |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key for running evals |

### 2. Verify Workflow Permissions

Ensure the workflow has necessary permissions:

```
Repository → Settings → Actions → General → Workflow permissions
```

Select: **Read and write permissions**

This allows the workflow to:
- Comment on pull requests
- Upload artifacts
- Update check runs

### 3. Test the Workflow

#### Option A: Push to Main
```bash
git add .
git commit -m "Add agent eval tests"
git push origin main
```

#### Option B: Create a Pull Request
```bash
git checkout -b test/agent-evals
git add .
git commit -m "Add agent eval tests"
git push origin test/agent-evals
# Create PR on GitHub
```

#### Option C: Manual Trigger
1. Go to **Actions** tab
2. Select **Portfolio Agent Evaluations** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### 4. Monitor Test Results

#### In GitHub Actions
1. Go to **Actions** tab
2. Click on the workflow run
3. View **Run Agent Eval Tests** job
4. Check console output for scores

#### In Pull Requests
The workflow will automatically comment with results:

```markdown
## Agent Evaluation Results

**Status**: Success

### Metrics Tested:
- [PASS] Answer Relevancy
- [PASS] Tone Consistency
- [PASS] Bias Detection
- [PASS] Toxicity Detection
- [PASS] Hallucination Detection
- [PASS] Prompt Alignment
- [PASS] Contact Information Accuracy
- [PASS] Edge Case Handling

See the workflow run for detailed results.
```

### 5. Download Eval Artifacts

After each run, artifacts are available for 30 days:

1. Go to workflow run
2. Scroll to **Artifacts** section
3. Download **eval-results**
4. Extract and review detailed logs

## Workflow Triggers

The workflow runs on:

### Pull Requests
```yaml
on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/mastra/**'
      - '**/*.eval.test.ts'
```

Runs when:
- PR opened to `main` or `develop`
- Changes to agent code or tests

### Push to Main
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/mastra/**'
```

Runs when:
- Code pushed directly to `main`
- PR merged to `main`

### Manual Trigger
```yaml
on:
  workflow_dispatch:
```

Runs when:
- Manually triggered from Actions tab

## Customizing the Workflow

### Change Timeout
Edit `.github/workflows/agent-evals.yml`:

```yaml
jobs:
  eval-tests:
    timeout-minutes: 30  # Change this value
```

### Add Slack Notifications
Add to workflow:

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Agent eval tests failed!"
      }
```

### Add Email Notifications
Add secret `EMAIL_RECIPIENT` and add step:

```yaml
- name: Send Email
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Agent Eval Tests Failed
    to: ${{ secrets.EMAIL_RECIPIENT }}
    from: GitHub Actions
    body: The agent eval tests have failed. Check the workflow run for details.
```

### Block PR Merge on Failure
The workflow already includes a quality gate:

```yaml
quality-gate:
  name: Quality Gate Check
  needs: eval-tests
  if: github.event_name == 'pull_request'
```

To enforce it:
1. Go to **Settings → Branches**
2. Add branch protection rule for `main`
3. Enable **Require status checks to pass**
4. Select **Quality Gate Check**

## Troubleshooting

### Workflow Not Running

**Check triggers**:
- Verify file paths match trigger patterns
- Ensure branch names are correct
- Check if workflow is disabled

**Fix**:
```bash
# Verify workflow file syntax
cat .github/workflows/agent-evals.yml

# Check workflow status
# Go to Actions → All workflows → Check if enabled
```

### Tests Failing in CI but Passing Locally

**Common causes**:
1. Missing environment variables
2. Different Node.js version
3. Rate limiting

**Fix**:
```yaml
# Add debug step
- name: Debug Environment
  run: |
    echo "Node version: $(node --version)"
    echo "pnpm version: $(pnpm --version)"
    env | grep -i openai || echo "OPENAI_API_KEY not set"
```

### Rate Limiting

**Problem**: Too many API calls to OpenAI

**Fix**:
```yaml
# Add delay between test suites
- name: Run eval tests
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    pnpm test:eval --reporter=verbose --maxConcurrency=1
```

### Timeout Issues

**Problem**: Tests taking too long

**Fix**:
```yaml
# Increase timeout
jobs:
  eval-tests:
    timeout-minutes: 45  # Increase from 30
```

Or reduce test scope:
```typescript
// In test file, skip some tests in CI
it.skipIf(process.env.CI)('expensive test', async () => {
  // ...
});
```

## Cost Management

### Estimate Costs

Each eval test run:
- ~25 test cases
- ~2-3 API calls per test (input + eval)
- ~50-75 total API calls per run

**Estimated cost per run**: $0.10 - $0.30

**Monthly estimate** (assuming 50 runs):
- 50 runs × $0.20 = **$10/month**

### Reduce Costs

**1. Limit test runs**:
```yaml
# Only run on specific paths
paths:
  - 'src/mastra/agents/**'  # Not all src/mastra
```

**2. Use cheaper model for evals**:
```typescript
// In test file
const evalModel = openai('gpt-4o-mini');  // Cheaper than gpt-4
```

**3. Cache results**:
```yaml
- name: Cache test results
  uses: actions/cache@v3
  with:
    path: test-results/
    key: eval-${{ hashFiles('src/mastra/agents/**') }}
```

**4. Run fewer tests in CI**:
```typescript
// test-data.ts
export const CI_TEST_CASES = TEST_CASES.slice(0, 10);  // Subset for CI

// In test file
const testCases = process.env.CI ? CI_TEST_CASES : TEST_CASES;
```

## Best Practices

### 1. Run Locally First
```bash
pnpm test:eval
```
Fix issues before pushing to avoid wasted CI runs.

### 2. Use Draft PRs
Mark PRs as draft while developing to prevent automatic runs.

### 3. Monitor Costs
Check OpenAI usage dashboard regularly:
https://platform.openai.com/usage

### 4. Set Budget Alerts
In OpenAI dashboard:
1. Go to **Settings → Billing**
2. Set **Usage limits**
3. Add email notifications

### 5. Review Failed Runs
Don't just re-run - investigate and fix root cause.

## Security Notes

### Protecting API Keys

**Never**:
- Commit API keys to repository
- Log API keys in workflow output
- Share secrets in PR comments

**Always**:
- Use GitHub Secrets
- Rotate keys periodically
- Use least-privilege keys

### Audit Access
Regularly review:
- Who has access to repository secrets
- Workflow run history
- API key usage patterns

## Next Steps

1. **Add secret**: `OPENAI_API_KEY`
2. **Test workflow**: Create a test PR
3. **Review results**: Check Actions tab
4. **Set up notifications**: Slack/Email (optional)
5. **Enable branch protection**: Require passing tests
6. **Monitor costs**: Check OpenAI usage

---

**Need Help?**
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
