#!/bin/bash

# ============================================================================
# GCP Secret Manager Setup Script
# ============================================================================
# This script creates all required secrets in GCP Secret Manager for the
# deploy2.yml workflow to work properly.
#
# Prerequisites:
# 1. gcloud CLI installed and authenticated
# 2. GCP project selected: gcloud config set project YOUR_PROJECT_ID
# 3. Secret Manager API enabled: gcloud services enable secretmanager.googleapis.com
# 4. Have all secret values ready
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  GCP Secret Manager Setup for AI E-Commerce App${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No GCP project selected. Run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using GCP Project: ${PROJECT_ID}${NC}"
echo ""

# Get project number for service account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
CLOUD_RUN_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo -e "${YELLOW}📝 This script will create the following secrets:${NC}"
echo ""
echo "Build-time secrets (for Cloud Build):"
echo "  1. next-public-clerk-key"
echo "  2. next-public-sanity-project-id"
echo "  3. next-public-sanity-dataset"
echo "  4. next-public-sanity-api-version"
echo "  5. next-public-base-url"
echo ""
echo "Runtime secrets (for Cloud Run):"
echo "  6. clerk-secret-key"
echo "  7. sanity-api-token"
echo "  8. google-ai-api-key"
echo "  9. phonepe-client-id"
echo "  10. phonepe-client-secret"
echo "  11. phonepe-merchant-id"
echo "  12. phonepe-webhook-username"
echo "  13. phonepe-webhook-password"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Aborted.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Creating secrets...${NC}"
echo ""

# Function to create secret
create_secret() {
    local secret_name=$1
    local secret_description=$2
    local prompt_text=$3
    
    echo -e "${YELLOW}Creating: ${secret_name}${NC}"
    echo -e "${BLUE}${secret_description}${NC}"
    read -sp "${prompt_text}: " secret_value
    echo
    
    # Create secret
    echo "$secret_value" | gcloud secrets create $secret_name \
        --data-file=- \
        --replication-policy="automatic" 2>/dev/null || {
        echo -e "${YELLOW}  Secret already exists, updating version...${NC}"
        echo "$secret_value" | gcloud secrets versions add $secret_name --data-file=-
    }
    
    echo -e "${GREEN}  ✓ Created/Updated${NC}"
    echo ""
}

# ============================================================================
# BUILD-TIME SECRETS (for Cloud Build)
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  PART 1: Build-Time Secrets${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

create_secret "next-public-clerk-key" \
    "Clerk publishable key (starts with pk_test_ or pk_live_)" \
    "Enter NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"

create_secret "next-public-sanity-project-id" \
    "Sanity project ID (alphanumeric string)" \
    "Enter NEXT_PUBLIC_SANITY_PROJECT_ID"

create_secret "next-public-sanity-dataset" \
    "Sanity dataset name (e.g., production, development)" \
    "Enter NEXT_PUBLIC_SANITY_DATASET"

create_secret "next-public-sanity-api-version" \
    "Sanity API version (e.g., 2024-01-01)" \
    "Enter NEXT_PUBLIC_SANITY_API_VERSION"

create_secret "next-public-base-url" \
    "Base URL of your app (e.g., https://your-app.run.app)" \
    "Enter NEXT_PUBLIC_BASE_URL"

# ============================================================================
# RUNTIME SECRETS (for Cloud Run)
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  PART 2: Runtime Secrets${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

create_secret "clerk-secret-key" \
    "Clerk secret key (starts with sk_test_ or sk_live_)" \
    "Enter CLERK_SECRET_KEY"

create_secret "sanity-api-token" \
    "Sanity API token with write permissions" \
    "Enter SANITY_API_TOKEN"

create_secret "google-ai-api-key" \
    "Google Gemini API key" \
    "Enter GOOGLE_GENERATIVE_AI_API_KEY"

create_secret "phonepe-client-id" \
    "PhonePe client ID" \
    "Enter PHONEPE_CLIENT_ID"

create_secret "phonepe-client-secret" \
    "PhonePe client secret" \
    "Enter PHONEPE_CLIENT_SECRET"

create_secret "phonepe-merchant-id" \
    "PhonePe merchant ID" \
    "Enter PHONEPE_MERCHANT_ID"

create_secret "phonepe-webhook-username" \
    "PhonePe webhook basic auth username" \
    "Enter PHONEPE_WEBHOOK_USERNAME"

create_secret "phonepe-webhook-password" \
    "PhonePe webhook basic auth password" \
    "Enter PHONEPE_WEBHOOK_PASSWORD"

# ============================================================================
# GRANT IAM PERMISSIONS
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  PART 3: Granting IAM Permissions${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}Granting Cloud Build service account access to build-time secrets...${NC}"

for secret in next-public-clerk-key next-public-sanity-project-id next-public-sanity-dataset next-public-sanity-api-version next-public-base-url; do
    gcloud secrets add-iam-policy-binding $secret \
        --member="serviceAccount:${CLOUD_BUILD_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet 2>/dev/null || true
    echo -e "${GREEN}  ✓ ${secret}${NC}"
done

echo ""
echo -e "${YELLOW}Granting Cloud Run service account access to runtime secrets...${NC}"

for secret in clerk-secret-key sanity-api-token google-ai-api-key phonepe-client-id phonepe-client-secret phonepe-merchant-id phonepe-webhook-username phonepe-webhook-password; do
    gcloud secrets add-iam-policy-binding $secret \
        --member="serviceAccount:${CLOUD_RUN_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet 2>/dev/null || true
    echo -e "${GREEN}  ✓ ${secret}${NC}"
done

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${GREEN}All secrets have been created and IAM permissions granted.${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Verify secrets: gcloud secrets list"
echo "  2. Test deployment: Go to GitHub Actions → deploy2.yml → Run workflow"
echo "  3. Monitor build: gcloud builds list --limit=5"
echo ""
echo -e "${BLUE}Service Accounts:${NC}"
echo "  Cloud Build: ${CLOUD_BUILD_SA}"
echo "  Cloud Run:   ${CLOUD_RUN_SA}"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
