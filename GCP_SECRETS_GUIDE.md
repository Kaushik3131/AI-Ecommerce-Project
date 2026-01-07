# 🔐 GCP Secret Manager Deployment Guide

This guide explains how to use the new `deploy2.yml` workflow that leverages **GCP Secret Manager** for all secrets instead of GitHub Secrets.

---

## 📋 Overview

### **Current Setup (deploy.yml)**
- ❌ All secrets stored in GitHub Secrets
- ❌ Secrets passed via `--substitutions` (long command)
- ❌ Secrets visible in GitHub Actions logs
- ✅ Auto-deploys on push to main

### **New Setup (deploy2.yml)**
- ✅ All secrets stored in GCP Secret Manager
- ✅ Clean deployment commands
- ✅ Better security and audit trail
- ✅ Manual deployment only (workflow_dispatch)

---

## 🚀 Quick Start

### **Step 1: Enable Secret Manager API**

```bash
gcloud services enable secretmanager.googleapis.com
```

### **Step 2: Run Setup Script**

```bash
# Make script executable
chmod +x setup-gcp-secrets.sh

# Run the script (it will prompt for all secret values)
./setup-gcp-secrets.sh
```

The script will:
1. Create 13 secrets in GCP Secret Manager
2. Grant IAM permissions to Cloud Build service account
3. Grant IAM permissions to Cloud Run service account

### **Step 3: Trigger Deployment**

1. Go to GitHub → Actions → **Build & Deploy to Cloud Run (GCP Secrets)**
2. Click **Run workflow**
3. Optionally add a deployment reason
4. Click **Run workflow** button

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/deploy2.yml` | GitHub Actions workflow using GCP secrets |
| `cloudbuild2.yaml` | Cloud Build config that fetches secrets from GCP |
| `setup-gcp-secrets.sh` | Interactive script to create all secrets |
| `GCP_SECRETS_GUIDE.md` | This documentation file |

---

## 🔑 Secrets Configuration

### **Build-Time Secrets** (used during Docker build)

These are embedded into the Next.js build:

| Secret Name in GCP | Environment Variable | Description |
|-------------------|---------------------|-------------|
| `next-public-clerk-key` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `next-public-sanity-project-id` | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `next-public-sanity-dataset` | `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `next-public-sanity-api-version` | `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |
| `next-public-base-url` | `NEXT_PUBLIC_BASE_URL` | App base URL |

**IAM Permission:** Cloud Build service account needs `roles/secretmanager.secretAccessor`

---

### **Runtime Secrets** (used by Cloud Run at runtime)

These are injected as environment variables in Cloud Run:

| Secret Name in GCP | Environment Variable | Description |
|-------------------|---------------------|-------------|
| `clerk-secret-key` | `CLERK_SECRET_KEY` | Clerk secret key |
| `sanity-api-token` | `SANITY_API_TOKEN` | Sanity API token |
| `google-ai-api-key` | `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key |
| `phonepe-client-id` | `PHONEPE_CLIENT_ID` | PhonePe client ID |
| `phonepe-client-secret` | `PHONEPE_CLIENT_SECRET` | PhonePe client secret |
| `phonepe-merchant-id` | `PHONEPE_MERCHANT_ID` | PhonePe merchant ID |
| `phonepe-webhook-username` | `PHONEPE_WEBHOOK_USERNAME` | Webhook basic auth username |
| `phonepe-webhook-password` | `PHONEPE_WEBHOOK_PASSWORD` | Webhook basic auth password |

**IAM Permission:** Cloud Run service account needs `roles/secretmanager.secretAccessor`

---

## 🔧 Manual Secret Management

### **Create a Secret**

```bash
echo "your-secret-value" | gcloud secrets create SECRET_NAME \
  --data-file=- \
  --replication-policy="automatic"
```

### **Update a Secret**

```bash
echo "new-secret-value" | gcloud secrets versions add SECRET_NAME \
  --data-file=-
```

### **View Secret Value**

```bash
gcloud secrets versions access latest --secret="SECRET_NAME"
```

### **List All Secrets**

```bash
gcloud secrets list
```

### **Delete a Secret**

```bash
gcloud secrets delete SECRET_NAME
```

---

## 🔐 IAM Permissions

### **Grant Cloud Build Access**

```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### **Grant Cloud Run Access**

```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🐛 Troubleshooting

### **Error: Permission denied on secret**

**Solution:** Grant IAM permissions to the service account:

```bash
# For build-time secrets
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# For runtime secrets
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

### **Error: Secret not found**

**Solution:** Create the secret first:

```bash
echo "value" | gcloud secrets create SECRET_NAME --data-file=-
```

---

### **Build fails with "$$VARIABLE not found"**

**Issue:** Secret not defined in `availableSecrets` section of `cloudbuild2.yaml`

**Solution:** Add the secret to both `secretEnv` and `availableSecrets`:

```yaml
secretEnv:
  - MY_SECRET
availableSecrets:
  secretManager:
    - versionName: projects/${PROJECT_ID}/secrets/my-secret/versions/latest
      env: MY_SECRET
```

---

### **Cloud Run deployment fails with secret error**

**Issue:** Secret not mounted or wrong name

**Solution:** Check the `--update-secrets` flag in `deploy2.yml`:

```yaml
--update-secrets="ENV_VAR_NAME=gcp-secret-name:latest"
```

---

## 📊 Comparison: deploy.yml vs deploy2.yml

| Feature | deploy.yml | deploy2.yml |
|---------|-----------|-------------|
| **Trigger** | Auto (push to main) | Manual only |
| **Secrets Location** | GitHub Secrets | GCP Secret Manager |
| **Build Secrets** | Via `--substitutions` | Via `availableSecrets` |
| **Runtime Secrets** | Via `--set-env-vars` | Via `--update-secrets` |
| **Security** | Good | Better (GCP audit logs) |
| **Ease of Update** | Update GitHub + redeploy | Update GCP only |
| **Secret Rotation** | Manual | Can be automated |
| **Audit Trail** | GitHub Actions logs | GCP Secret Manager logs |

---

## ✅ Benefits of GCP Secret Manager

1. **Centralized Management** - All secrets in one place
2. **Better Security** - Secrets never leave GCP
3. **Audit Logs** - Track who accessed secrets and when
4. **Automatic Rotation** - Can rotate secrets without code changes
5. **Versioning** - Keep history of secret values
6. **IAM Integration** - Fine-grained access control
7. **No GitHub Exposure** - Secrets not visible in GitHub UI

---

## 🎯 Recommended Workflow

1. **Development**: Use `deploy.yml` (auto-deploy on push)
2. **Production**: Use `deploy2.yml` (manual, controlled deployments)
3. **Secret Updates**: Update in GCP Secret Manager, then redeploy

---

## 📚 Additional Resources

- [GCP Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Build Secret Manager Integration](https://cloud.google.com/build/docs/securing-builds/use-secrets)
- [Cloud Run Secret Manager Integration](https://cloud.google.com/run/docs/configuring/secrets)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Cloud Build logs: `gcloud builds list --limit=5`
2. View build details: `gcloud builds describe BUILD_ID`
3. Check Cloud Run logs: `gcloud run services logs read SERVICE_NAME`
4. Verify IAM permissions: `gcloud secrets get-iam-policy SECRET_NAME`

---

**Created:** 2026-01-07  
**Last Updated:** 2026-01-07  
**Version:** 1.0
