# Setup GitHub Personal Access Token for CI/CD

The marketplace CI/CD workflow needs access to private submodules. Follow these steps to create and configure a Personal Access Token (PAT).

## Step 1: Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Configure the token:
   - **Note**: `Claude Plugins Marketplace CI/CD`
   - **Expiration**: 90 days (or longer if preferred)
   - **Scopes**: Check `repo` (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`
4. Click **"Generate token"**
5. **Copy the token immediately** (you won't be able to see it again!)
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Add Token as Repository Secret

### Option A: Using GitHub CLI (Recommended)

```bash
# Replace YOUR_TOKEN_HERE with the token you just copied
gh secret set PRIVATE_REPO_ACCESS_TOKEN \
  --repo jeb-leanix/claude-plugins-marketplace \
  --body "YOUR_TOKEN_HERE"
```

### Option B: Using GitHub Web UI

1. Go to https://github.com/jeb-leanix/claude-plugins-marketplace/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `PRIVATE_REPO_ACCESS_TOKEN`
4. Secret: Paste your token
5. Click **"Add secret"**

## Step 3: Verify Setup

1. Go to https://github.com/jeb-leanix/claude-plugins-marketplace/actions
2. Click **"Build Plugins"** workflow
3. Click **"Run workflow"** → **"Run workflow"** (to manually trigger)
4. Wait for the workflow to complete
5. Check that it succeeds and the `built` branch is updated

## Step 4: Test the Built Branch

```bash
cd /tmp
git clone -b built --recurse-submodules https://github.com/jeb-leanix/claude-plugins-marketplace.git test-marketplace
cd test-marketplace
ls -la plugins/*/build/  # Should show compiled plugins
```

## Troubleshooting

### Workflow still fails with "Repository not found"
- Verify the secret name is exactly `PRIVATE_REPO_ACCESS_TOKEN`
- Ensure the token has `repo` scope
- Check token hasn't expired
- Regenerate token if needed

### Token expires
- GitHub will email you 7 days before expiration
- Create a new token with same steps
- Update the secret with new token value

## Security Notes

- **Never commit the token to git**
- Store it in a password manager
- Use minimum required scopes
- Rotate regularly (every 90 days recommended)
- Revoke old tokens after rotation

## Token Scopes Explained

The `repo` scope is needed because:
- Private submodules require authentication
- `actions/checkout` uses the token to clone submodules
- Read access to private repos is required

Alternative (more restrictive) approach:
- Make all plugin repositories public
- Remove token requirement from workflow
- Simpler but less control over plugin visibility