# TODO: Fix Inventory List Page CORS Errors

## Issue
The inventory list page (`/admin/inventory`) is causing CORS errors on Cloud Run because it uses client-side Sanity API calls via `useDocuments` hook.

## Current State
- ✅ **Inventory Detail Page** (`/admin/inventory/[id]`) - WORKING
  - Server Component
  - Draft & Publish workflow
  - Optimistic UI for Price, Stock, Featured
  - No CORS errors
  
- ❌ **Inventory List Page** (`/admin/inventory`) - CORS ERRORS
  - Client Component
  - Uses `useDocuments` hook (client-side API call)
  - Causes CORS errors on Cloud Run

## Solution
Convert `/admin/inventory/page.tsx` to Server Component:

1. **Create server-side data fetcher** (`lib/data/products.ts`):
   ```typescript
   export async function getProducts(options?: {
     search?: string;
     limit?: number;
     offset?: number;
   }): Promise<ProductDetail[]>
   ```

2. **Convert page to Server Component**:
   - Remove `"use client"`
   - Remove `useDocuments`, `useApplyDocumentActions` hooks
   - Fetch products server-side
   - Use Server Actions for "Create Product"

3. **Keep search client-side**:
   - Use URL search params for filtering
   - Server Component refetches on param change

## Files to Modify
- `app/(admin)/admin/inventory/page.tsx` - Main list page
- `lib/data/products.ts` - Add `getProducts()` function
- `lib/actions/admin-mutations.ts` - Add `createProduct()` server action

## Reference
See `/admin/orders/page.tsx` for similar pattern (if it exists), or use the detail page pattern.

## Priority
Medium - The detail page works perfectly, list page is just for navigation.
