# 🚀 Quick Reference: GCP Secret Manager Deployment

## Setup (One-Time)

```bash
# 1. Enable API
gcloud services enable secretmanager.googleapis.com

# 2. Run setup script
chmod +x setup-gcp-secrets.sh
./setup-gcp-secrets.sh

# 3. Verify
gcloud secrets list
```

## Deploy

**GitHub Actions:**
1. Go to Actions → "Build & Deploy to Cloud Run (GCP Secrets)"
2. Click "Run workflow"
3. Done! ✅

## Update a Secret

```bash
# Update secret value
echo "new-value" | gcloud secrets versions add SECRET_NAME --data-file=-

# Redeploy to pick up changes
# (Go to GitHub Actions and run deploy2.yml)
```

## Common Commands

```bash
# List all secrets
gcloud secrets list

# View secret value
gcloud secrets versions access latest --secret="SECRET_NAME"

# Delete secret
gcloud secrets delete SECRET_NAME

# View IAM policy
gcloud secrets get-iam-policy SECRET_NAME
```

## Secrets Mapping

### Build-Time (5 secrets)
- `next-public-clerk-key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `next-public-sanity-project-id` → `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `next-public-sanity-dataset` → `NEXT_PUBLIC_SANITY_DATASET`
- `next-public-sanity-api-version` → `NEXT_PUBLIC_SANITY_API_VERSION`
- `next-public-base-url` → `NEXT_PUBLIC_BASE_URL`

### Runtime (8 secrets)
- `clerk-secret-key` → `CLERK_SECRET_KEY`
- `sanity-api-token` → `SANITY_API_TOKEN`
- `google-ai-api-key` → `GOOGLE_GENERATIVE_AI_API_KEY`
- `phonepe-client-id` → `PHONEPE_CLIENT_ID`
- `phonepe-client-secret` → `PHONEPE_CLIENT_SECRET`
- `phonepe-merchant-id` → `PHONEPE_MERCHANT_ID`
- `phonepe-webhook-username` → `PHONEPE_WEBHOOK_USERNAME`
- `phonepe-webhook-password` → `PHONEPE_WEBHOOK_PASSWORD`

## Troubleshooting

**Permission denied?**
```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

# For build secrets
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# For runtime secrets
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**Check build logs:**
```bash
gcloud builds list --limit=5
gcloud builds describe BUILD_ID
```

**Check deployment logs:**
```bash
gcloud run services logs read ai-ecommerce-app --limit=50
```

## Files

- `.github/workflows/deploy2.yml` - GitHub Actions workflow
- `cloudbuild2.yaml` - Cloud Build configuration
- `setup-gcp-secrets.sh` - Setup script
- `GCP_SECRETS_GUIDE.md` - Full documentation

---

**Need help?** See `GCP_SECRETS_GUIDE.md` for detailed documentation.
