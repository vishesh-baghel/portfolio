# GitHub Actions Setup Guide

Complete guide for setting up CI/CD for @vishesh/experiments.

## Prerequisites

1. **GitHub Repository**: Code pushed to GitHub
2. **npm Account**: Account at npmjs.com
3. **npm Access Token**: Required for publishing

## Step 1: Create npm Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Click your profile → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type
5. Copy the token (starts with `npm_...`)

## Step 2: Add npm Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

## Step 3: Verify Workflows

Two workflows are configured:

### Testing Workflow
**File**: `.github/workflows/experiments-mcp-test.yml`

**Triggers**:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Changes to package or experiments

**What it does**:
- Runs all tests
- Verifies build
- Checks experiments copied
- Tests MCP server startup

### Publishing Workflow
**File**: `.github/workflows/experiments-mcp-publish.yml`

**Triggers**:
- Git tags: `experiments-mcp-v*.*.*`
- Manual dispatch

**What it does**:
- Runs tests (must pass)
- Publishes to npm
- Creates GitHub release

## Step 4: Publishing a Release

### Option A: Using Git Tags (Recommended)

```bash
# Update version in package.json
cd packages/experiments-mcp
npm version 1.0.1  # or patch/minor/major

# Create and push tag
git add package.json
git commit -m "chore: bump version to 1.0.1"
git tag experiments-mcp-v1.0.1
git push origin main --tags
```

The workflow will automatically:
1. Run tests
2. Build package
3. Publish to npm
4. Create GitHub release

### Option B: Manual Workflow Dispatch

1. Go to **Actions** tab in GitHub
2. Select **Experiments MCP - Publish to npm**
3. Click **Run workflow**
4. Enter version (e.g., `1.0.1`)
5. Click **Run workflow**

## Step 5: Verify Publication

After workflow completes:

1. **Check npm**: https://www.npmjs.com/package/@vishesh/experiments
2. **Check GitHub Releases**: Your repo's releases page
3. **Test installation**:
   ```bash
   npm install @vishesh/experiments
   ```

## Workflow Status Badges

Add to README.md:

```markdown
[![Test](https://github.com/vishesh-baghel/portfolio/actions/workflows/experiments-mcp-test.yml/badge.svg)](https://github.com/vishesh-baghel/portfolio/actions/workflows/experiments-mcp-test.yml)
[![npm version](https://badge.fury.io/js/@vishesh%2Fexperiments.svg)](https://www.npmjs.com/package/@vishesh/experiments)
```

## Troubleshooting

### Tests Fail in CI

**Check**:
```bash
# Run tests locally first
pnpm --filter @vishesh/experiments test

# Check build
pnpm --filter @vishesh/experiments build
```

### npm Publish Fails

**Common Issues**:
1. **Token invalid**: Regenerate npm token
2. **Version exists**: Bump version number
3. **Package name taken**: Change name in package.json

**Verify token**:
```bash
# Test token locally
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" > ~/.npmrc
npm whoami
```

### Workflow Not Triggering

**Check**:
1. Workflow files in `.github/workflows/`
2. Correct branch names (`main` vs `master`)
3. File paths in triggers match actual structure

## Security Best Practices

1. ✅ Use `NPM_TOKEN` secret (never commit tokens)
2. ✅ Use `--provenance` flag for npm publish
3. ✅ Enable 2FA on npm account
4. ✅ Use automation tokens (not personal tokens)
5. ✅ Regularly rotate tokens

## Monitoring

### GitHub Actions

- **Actions tab**: View all workflow runs
- **Email notifications**: Enabled by default for failures
- **Status checks**: Required for PRs (optional)

### npm

- **Download stats**: npmjs.com package page
- **Version history**: All published versions
- **Deprecation**: Can deprecate old versions

## Maintenance

### Regular Tasks

- **Monthly**: Review and update dependencies
- **Quarterly**: Rotate npm access token
- **Per release**: Update CHANGELOG.md
- **Per release**: Test installation in fresh environment

### Version Strategy

Following [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.x): Bug fixes, no breaking changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

---

**Last Updated**: 2025-01-09  
**Status**: ✅ Ready for Production
