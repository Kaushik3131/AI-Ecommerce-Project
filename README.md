# 📊 AI E-Commerce App - Complete Project Analysis

## 🎯 Project Overview

This is a **premium AI-powered furniture e-commerce application** built with Next.js 16, featuring an intelligent shopping assistant powered by Google's Gemini AI. The application combines modern e-commerce functionality with conversational AI to provide a unique shopping experience.

---

## 🏗️ Architecture & Tech Stack

### **Core Framework**
- **Next.js 16.1.1** (App Router with React 19.2.3)
- **TypeScript** with strict mode enabled
- **React Compiler** enabled for optimizations

### **Content Management**
- **Sanity CMS v4** - Headless CMS for product/order management
- **Sanity Studio** - Mounted at `/studio` route
- **Sanity Live** - Real-time content updates
- **GROQ** - Query language for content fetching

### **AI & Chat**
- **Vercel AI SDK v6** - AI framework
- **Google Gemini 3 Flash Preview** - LLM model
- **Tool Loop Agent** - Agentic AI pattern with function calling
- **Custom AI Tools**:
  - `searchProducts` - Product search with filters
  - `getMyOrders` - User order retrieval (auth-required)

### **Authentication & Payments**
- **Clerk** - User authentication & session management
- **Stripe** - Payment processing & checkout
- **Stripe Webhooks** - Order fulfillment automation

### **State Management**
- **Zustand** - Client-side state management
- **Vanilla Zustand stores** with providers:
  - `cart-store` - Shopping cart (persisted to localStorage)
  - `chat-store` - Chat UI state (ephemeral)

### **Styling & UI**
- **Tailwind CSS v4** with custom theme
- **Radix UI** - Accessible component primitives (40+ components)
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **Embla Carousel** - Featured products carousel
- **Sonner** - Toast notifications
- **Dark mode** support with `next-themes`

### **Code Quality**
- **Biome** - Fast linter & formatter (replacing ESLint/Prettier)
- **TypeScript strict mode**
- **React Hook Form** with Zod validation

---

## 📁 Project Structure

```
ai-ecommerce-app/
├── app/
│   ├── (app)/              # Main storefront routes
│   │   ├── page.tsx        # Homepage with products
│   │   ├── layout.tsx      # App layout with providers
│   │   ├── products/[slug]/ # Product detail pages
│   │   ├── checkout/       # Checkout flow
│   │   └── orders/         # Order history & details
│   ├── (admin)/            # Admin dashboard routes
│   │   └── admin/
│   │       ├── inventory/  # Product management
│   │       └── orders/     # Order management
│   ├── api/
│   │   ├── chat/           # AI chat endpoint
│   │   └── webhooks/stripe/ # Stripe webhook handler
│   ├── studio/             # Sanity Studio CMS
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── app/                # Storefront components (38 files)
│   ├── admin/              # Admin components (17 files)
│   ├── ui/                 # shadcn/ui components (47 files)
│   ├── providers/          # Context providers
│   └── loaders/            # Loading states
├── lib/
│   ├── ai/
│   │   ├── shopping-agent.ts    # Main AI agent
│   │   ├── tools/
│   │   │   ├── search-products.ts
│   │   │   └── get-my-orders.ts
│   │   └── types.ts
│   ├── actions/
│   │   ├── checkout.ts     # Server actions for checkout
│   │   └── customer.ts     # Stripe customer management
│   ├── store/
│   │   ├── cart-store.ts   # Cart state
│   │   └── chat-store.ts   # Chat state
│   ├── constants/          # App constants
│   └── utils.ts            # Utility functions
├── sanity/
│   ├── schemaTypes/
│   │   ├── productType.ts  # Product schema
│   │   ├── orderType.ts    # Order schema
│   │   ├── categoryType.ts # Category schema
│   │   └── customerType.ts # Customer schema
│   ├── queries/            # GROQ queries
│   ├── lib/                # Sanity client & helpers
│   └── env.ts              # Sanity config
├── public/                 # Static assets
├── .env.local              # Environment variables (gitignored)
├── next.config.ts          # Next.js configuration
├── sanity.config.ts        # Sanity Studio config
├── biome.json              # Biome linter config
└── package.json
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20+ installed
- pnpm package manager
- Sanity account
- Clerk account
- Stripe account
- Google AI API key

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-ecommerce-app
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Deployment
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Run the development server**
```bash
pnpm dev
```

5. **Access the application**
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

### **Available Scripts**

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
pnpm typegen      # Generate Sanity types
```

---

## 🤖 AI Shopping Agent

### **Agent Architecture**

The AI agent uses a **Tool Loop Agent** pattern with context-aware tool availability:

```typescript
createShoppingAgent({ userId })
  → Authenticated: searchProducts + getMyOrders tools
  → Guest: searchProducts tool only
```

### **Tool: searchProducts**

**Purpose**: Search and filter furniture products

**Parameters**:
- `query` - Text search (name/description)
- `category` - Category slug (sofas, tables, chairs, etc.)
- `material` - Filter by material (wood, metal, fabric, leather, glass)
- `color` - Filter by color (black, white, oak, walnut, grey, natural)
- `minPrice` / `maxPrice` - Price range in GBP

**Returns**:
- Product details (name, price, dimensions, etc.)
- Stock status (in_stock, low_stock, out_of_stock)
- Product URLs for navigation

### **Tool: getMyOrders**

**Purpose**: Retrieve user's order history

**Parameters**:
- `status` - Optional filter (pending, paid, shipped, delivered, cancelled)

**Returns**:
- Order summaries with status, items, totals
- Order URLs for detailed view

### **AI Instructions**

The agent has detailed instructions for:
- **Product search strategies** (category-first, then filters)
- **Stock awareness** (warn about low/out of stock)
- **Similar product recommendations** (exclude exact matches)
- **Order status communication** (with emoji indicators)
- **Authentication handling** (prompt sign-in for orders)

---

## 🛒 E-Commerce Features

### **Product Management**
- **Sanity CMS** for content management
- Product fields: name, slug, description, price, category, material, color, dimensions, images, stock, featured flag
- **Real-time stock tracking**
- **Featured products carousel** on homepage
- **Category-based navigation**

### **Shopping Cart**
- **Zustand store** with localStorage persistence
- Add/remove/update quantity
- Stock validation before checkout
- Cart sheet (slide-out panel)

### **Checkout Flow**
1. **Cart validation** - Check stock availability
2. **Stripe Checkout Session** - Secure payment
3. **Shipping address collection** (45+ countries supported)
4. **Webhook processing** - Create Sanity order on payment success
5. **Success page** - Order confirmation

### **Order Management**
- **Customer orders** linked to Clerk user ID
- **Order statuses**: pending → paid → shipped → delivered
- **Admin dashboard** for order fulfillment
- **Order history** for customers

---

## 🎨 UI/UX Features

### **Design System**
- **OKLCH color space** for consistent colors
- **Dark mode** with smooth transitions
- **Custom CSS variables** for theming
- **Responsive design** (mobile-first)

### **Key Components**

**Storefront**:
- `Header` - Navigation with cart/chat/auth
- `FeaturedCarousel` - Auto-playing product carousel
- `CategoryTiles` - Category navigation
- `ProductGrid` - Product listing with filters
- `ProductCard` - Product preview with stock badge
- `ProductGallery` - Image viewer on product page
- `CartSheet` - Slide-out shopping cart
- `ChatSheet` - AI assistant interface

**Admin**:
- `StatCard` - Dashboard metrics
- `RecentOrders` - Order list
- `ProductRow` / `OrderRow` - Table rows
- `ImageUploader` - Product image management
- `StatusSelect` - Order status updates

**Chat UI**:
- `MessageBubble` - Chat messages
- `ToolCallUI` - Loading states for AI tools
- `ProductCardWidget` - Product cards in chat
- `OrderCardWidget` - Order cards in chat

---

## 🔐 Authentication & Authorization

### **Clerk Integration**
- **Sign in/Sign up** flows
- **User sessions** with server-side validation
- **Protected routes** (checkout, orders, admin)
- **User metadata** synced to Stripe & Sanity

### **Role-Based Access**
- **Guest users**: Browse products, use AI chat (search only)
- **Authenticated users**: Full checkout, order history, AI order tracking
- **Admin users**: Dashboard access (inventory & order management)

---

## 💳 Payment & Fulfillment

### **Stripe Integration**

**Checkout Flow**:
1. Create Stripe customer (or retrieve existing)
2. Validate cart items against Sanity
3. Create Checkout Session with line items
4. Redirect to Stripe-hosted checkout
5. Handle success/cancel redirects

**Webhook Handler** (`/api/webhooks/stripe`):
- Verifies webhook signature
- Handles `checkout.session.completed` event
- Creates Sanity order document
- Links order to customer
- Decrements product stock

**Supported Countries**: 45+ countries for shipping

---

## 📊 Data Models (Sanity Schemas)

### **Product**
```typescript
{
  name: string
  slug: slug
  description: text
  price: number (GBP)
  category: reference
  material: enum
  color: enum
  dimensions: string
  images: image[]
  stock: number
  featured: boolean
  assemblyRequired: boolean
}
```

### **Order**
```typescript
{
  orderNumber: string
  customer: reference
  clerkUserId: string
  stripeSessionId: string
  items: array
  total: number
  status: enum (pending/paid/shipped/delivered/cancelled)
  shippingAddress: object
  createdAt: datetime
}
```

### **Category**
```typescript
{
  title: string
  slug: slug
  description: text
}
```

### **Customer**
```typescript
{
  clerkUserId: string
  stripeCustomerId: string
  email: string
  name: string
}
```

---

## 🚀 Key Features Summary

✅ **AI-Powered Shopping Assistant** (Gemini 3 Flash)  
✅ **Real-time Product Search** with filters  
✅ **Order Tracking** via conversational AI  
✅ **Secure Checkout** with Stripe  
✅ **Stock Management** with low-stock alerts  
✅ **Admin Dashboard** for inventory & orders  
✅ **Dark Mode** support  
✅ **Responsive Design** (mobile/tablet/desktop)  
✅ **Real-time Content** via Sanity Live  
✅ **Type-safe** with TypeScript  
✅ **Modern Tooling** (Biome, React Compiler)  

---

## 📈 Performance Optimizations

- **React Compiler** - Automatic memoization
- **Server Components** - Reduced client JS
- **Streaming SSR** - Fast initial page loads
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Route-based chunks
- **Zustand** - Lightweight state management
- **Biome** - Fast linting/formatting

---

## 🛡️ Security Considerations

✅ **Server-side validation** for all critical operations  
✅ **Stripe webhook signature verification**  
✅ **Clerk session validation** on protected routes  
✅ **Environment variables** for secrets  
✅ **CORS** handled by Next.js API routes  
✅ **Type safety** with TypeScript & Zod  

---

## 📝 Notable Implementation Details

### **AI Agent Context Awareness**
The agent adapts its capabilities based on authentication:
- Guests get product search only
- Authenticated users get order tracking
- Instructions change dynamically

### **Cart Persistence Strategy**
- Uses Zustand's `persist` middleware
- `skipHydration` for Next.js SSR compatibility
- Only persists `items`, not UI state (`isOpen`)

### **Sanity Live Integration**
- Real-time content updates without page refresh
- Used in product listings and admin dashboard

### **Stripe Customer Management**
- Creates/retrieves Stripe customer on checkout
- Links to Sanity customer document
- Stores Clerk user ID for cross-reference

---

## 🎨 Design Patterns Used

- **Server Actions** - Type-safe server mutations
- **Provider Pattern** - Zustand store providers
- **Tool Loop Agent** - Agentic AI with function calling
- **Compound Components** - UI component composition
- **Optimistic Updates** - Cart UI updates
- **Suspense Boundaries** - Loading states
- **Error Boundaries** - Graceful error handling

---

## 🔮 Potential Enhancements

Based on the codebase structure, here are areas for future improvement:

1. **Analytics** - Track user behavior, conversions
2. **Reviews & Ratings** - Customer feedback system
3. **Wishlist** - Save products for later
4. **Product Recommendations** - ML-based suggestions
5. **Email Notifications** - Order confirmations, shipping updates
6. **Multi-currency** - Support for other currencies
7. **Inventory Alerts** - Admin notifications for low stock
8. **Advanced Search** - Faceted search, autocomplete
9. **Product Variants** - Size/color options
10. **Discount Codes** - Promotional pricing

---

## 📚 Dependencies Breakdown

### **Production Dependencies (76 total)**
- **AI**: `ai`, `@ai-sdk/google`, `@ai-sdk/react`
- **Auth**: `@clerk/nextjs`
- **CMS**: `@sanity/*` (client, vision, image-url, sdk-react)
- **UI**: `@radix-ui/*` (40+ components), `lucide-react`
- **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **State**: `zustand`
- **Payments**: `stripe`
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`

### **Dev Dependencies (7 total)**
- **Linting**: `@biomejs/biome`
- **Styling**: `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`
- **Types**: `@types/node`, `@types/react`, `@types/react-dom`
- **Compiler**: `babel-plugin-react-compiler`

---

## 🚢 Deployment

### **Recommended Platform: Vercel**

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Configure environment variables
- Deploy

3. **Configure Stripe Webhooks**
- Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
- Select event: `checkout.session.completed`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

4. **Update Environment Variables**
- Set `NEXT_PUBLIC_BASE_URL` to your production URL
- Ensure all other env vars are configured

### **Alternative Platforms**
- **Netlify** - Supports Next.js
- **Railway** - Easy deployment
- **Self-hosted** - Docker/VPS

---

## 🐛 Troubleshooting

### **Comm

---

## ⚠️ Known Limitations

### **Admin Panel Production Access**

**Issue**: Admin mutations (updating inventory/orders) don't work on Cloud Run due to Sanity's client-side token security restrictions.

**Symptoms**:
- Admin panel works perfectly on `localhost`
- On production (Cloud Run), updates "snap back" to original values
- Browser console shows `403 Forbidden` errors from Sanity API

**Root Cause**: 
Sanity blocks client-side mutations with server tokens in production for security. The `@sanity/sdk-react` library is designed for Sanity's own authentication system, not custom API tokens.

**Current Workarounds**:
1. **Use admin panel locally**: Run `pnpm dev` and manage inventory/orders on `localhost:3000/admin`
2. **Use Sanity Studio**: Access `/studio` on production - it works because it uses Sanity's authentication
3. **Direct Sanity dashboard**: Manage content at `manage.sanity.io`

**Proper Solution** (planned for future release):
Refactor admin mutations to use Next.js server actions instead of client-side `@sanity/sdk-react` hooks. This involves:
- Creating API routes for each mutation (update product, update order status, etc.)
- Calling these routes from the admin UI
- Server routes use `writeClient` with the API token (secure)

**Impact**: 
- ✅ Customer-facing features work perfectly (shop, checkout, orders)
- ✅ Webhooks create orders successfully
- ❌ Admin panel only works locally

**Status**: Low priority - admin panel works locally, and Sanity Studio provides full production access.

---

## 📄 License

This project is private and proprietary.

---

## 👥 Contributing

This is a private project. For questions or issues, contact the development team.

---

## 📞 Support

For technical support or questions:
- Check the documentation above
- Review the codebase comments
- Contact the development team

---

**Built with ❤️ using Next.js, Sanity, Stripe, and Google Gemini AI**
