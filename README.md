# 🛍️ AI-Powered E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-Deployed-4285F4?style=for-the-badge&logo=google-cloud)

A modern furniture e-commerce platform with an intelligent AI shopping assistant powered by Google Gemini

**🚀 [Live Demo on Cloud Run](https://ai-ecommerce-app-812536730646.asia-south1.run.app)**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Deployment](#-deployment)

</div>

---

## 🎯 Overview

An enterprise-grade e-commerce platform that revolutionizes online shopping with a conversational AI assistant. Customers can search products, track orders, and get recommendations using natural language, while admins manage inventory and orders through a powerful dashboard.

### Why This Project?

Traditional e-commerce sites require users to navigate complex filters and categories. This platform introduces an **AI shopping assistant** that understands natural language queries like:

- *"Show me wooden dining tables under £500"*
- *"What's the status of my order?"*
- *"I need a grey sofa for a small living room"*

---

## ✨ Features

### 🤖 AI Shopping Assistant
- **Natural Language Search** - Find products using conversational queries
- **Smart Filtering** - Automatic category, material, color, and price filtering
- **Stock Awareness** - Real-time inventory updates with low-stock warnings
- **Order Tracking** - Check order status through chat interface
- **Personalized Recommendations** - AI-powered product suggestions
- **Multi-turn Conversations** - Maintains context across chat sessions

### 🛒 Customer Experience
- **Featured Products Carousel** - Auto-playing showcase with smooth transitions
- **Advanced Product Filters** - Filter by category, material, color, price
- **Real-time Cart** - Persistent shopping cart with stock validation
- **Secure Checkout** - Stripe-powered payment processing
- **Order History** - Complete order tracking and management
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Mode** - Seamless theme switching with system preference detection

### 👨‍💼 Admin Dashboard
- **Inventory Management** - Full CRUD operations for products
- **Order Fulfillment** - Update order status (pending → paid → shipped → delivered)
- **Stock Control** - Track inventory levels with low-stock alerts
- **Image Management** - Multi-image upload with drag-and-drop
- **Analytics Dashboard** - Revenue, orders, and inventory metrics
- **Bulk Operations** - Manage multiple products/orders efficiently

### 🔐 Security & Authentication
- **User Authentication** - Clerk-powered auth with social login
- **Role-Based Access** - Customer vs Admin permissions
- **Secure Payments** - PCI-compliant Stripe integration
- **Webhook Verification** - Cryptographic signature validation
- **Environment Security** - Secret management with validation

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library

### AI & Intelligence
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI framework for streaming responses
- **[Google Gemini 3 Flash](https://ai.google.dev/)** - Large language model
- **Agentic AI Pattern** - Tool-calling architecture with function calling
- **Custom Tools**: `searchProducts`, `getMyOrders`

### Backend & Database
- **[Sanity CMS](https://www.sanity.io/)** - Headless content management
- **[GROQ](https://www.sanity.io/docs/groq)** - Graph-relational query language
- **Server Actions** - Type-safe server mutations
- **Real-time Updates** - Sanity Live for instant content sync

### Payments & Auth
- **[Stripe](https://stripe.com/)** - Payment processing and checkout
- **[Clerk](https://clerk.com/)** - User authentication and management
- **Webhook Integration** - Automated order fulfillment

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management (3KB)
- **LocalStorage Persistence** - Cart state persistence
- **Optimistic Updates** - Instant UI feedback

### DevOps & Tools
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[Docker](https://www.docker.com/)** - Containerization
- **[Google Cloud Run](https://cloud.google.com/run)** - Serverless deployment
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Sanity account** - [Sign up](https://www.sanity.io/)
- **Clerk account** - [Sign up](https://clerk.com/)
- **Stripe account** - [Sign up](https://stripe.com/)
- **Google AI API key** - [Get key](https://ai.google.dev/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Kaushik3131/AI-Ecommerce-Project.git
cd AI-Ecommerce-Project
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-15
SANITY_API_TOKEN=skxxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxx

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Set up Sanity**

```bash
# Install Sanity CLI globally
npm install -g sanity

# Login to Sanity
sanity login

# Initialize Sanity project (if not done)
sanity init

# Import sample data (optional)
sanity dataset import sample-data.ndjson production
```

5. **Run the development server**

```bash
pnpm dev
```

6. **Access the application**

- **Storefront**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio
- **Admin Dashboard**: http://localhost:3000/admin

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
pnpm typegen      # Generate Sanity TypeScript types
```

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js 16 Frontend (React 19 + TypeScript)                │
│  ├── Customer Pages (/products, /checkout, /orders)         │
│  ├── Admin Dashboard (/admin/inventory, /admin/orders)      │
│  └── AI Chat Interface (Streaming responses)                │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─────────────────┬──────────────────┬────────────┐
             ▼                 ▼                  ▼            ▼
    ┌─────────────┐   ┌──────────────┐   ┌──────────┐  ┌─────────┐
    │ Sanity CMS  │   │  Google AI   │   │  Stripe  │  │  Clerk  │
    │  (Content)  │   │   (Gemini)   │   │(Payments)│  │ (Auth)  │
    └─────────────┘   └──────────────┘   └──────────┘  └─────────┘
```

### AI Agent Architecture

```typescript
┌────────────────────────────────────────────────────┐
│         AI Shopping Agent (Gemini 3 Flash)         │
├────────────────────────────────────────────────────┤
│  Context-Aware Tool Selection:                     │
│                                                     │
│  Guest User:                                       │
│    └── searchProducts (public access)             │
│                                                     │
│  Authenticated User:                               │
│    ├── searchProducts (full access)                │
│    └── getMyOrders (auth required)                 │
└────────────────────────────────────────────────────┘
```

### Data Flow

```
Product Search Flow:
User Query → AI Agent → Tool Selection → Sanity Query → Results → AI Response

Checkout Flow:
Cart → Validation → Stripe Session → Payment → Webhook → Sanity Order → Confirmation

Order Update Flow:
Admin Action → Server Action → Sanity Mutation → Real-time Update → Customer View
```

---

## 📁 Project Structure

```
ai-ecommerce-app/
├── app/
│   ├── (app)/                    # Customer-facing routes
│   │   ├── page.tsx              # Homepage with products
│   │   ├── products/             # Product catalog
│   │   │   └── [slug]/           # Product detail pages
│   │   ├── checkout/             # Stripe checkout
│   │   │   ├── page.tsx
│   │   │   ├── success/
│   │   │   └── cancelled/
│   │   └── orders/               # Order history
│   │       ├── page.tsx
│   │       └── [id]/
│   ├── (admin)/                  # Admin routes
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard
│   │       ├── inventory/        # Product management
│   │       └── orders/           # Order fulfillment
│   ├── api/
│   │   ├── chat/                 # AI chat endpoint
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/           # Stripe webhook handler
│   │           └── route.ts
│   ├── studio/                   # Sanity Studio CMS
│   │   └── [[...tool]]/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── app/                      # Customer components (38 files)
│   │   ├── Header.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartSheet.tsx
│   │   └── ChatSheet.tsx
│   ├── admin/                    # Admin components (17 files)
│   │   ├── StatCard.tsx
│   │   ├── RecentOrders.tsx
│   │   ├── ProductRow.tsx
│   │   └── OrderRow.tsx
│   ├── ui/                       # shadcn/ui components (47 files)
│   ├── providers/                # Context providers
│   │   ├── CartStoreProvider.tsx
│   │   └── ChatStoreProvider.tsx
│   └── loaders/                  # Loading states
├── lib/
│   ├── ai/
│   │   ├── shopping-agent.ts    # Core AI agent logic
│   │   ├── tools/
│   │   │   ├── search-products.ts
│   │   │   └── get-my-orders.ts
│   │   └── types.ts
│   ├── actions/                 # Server actions
│   │   ├── checkout.ts
│   │   └── customer.ts
│   ├── store/
│   │   ├── cart-store.ts        # Zustand cart store
│   │   └── chat-store.ts        # Zustand chat store
│   ├── constants/               # App constants
│   └── utils.ts                 # Utility functions
├── sanity/
│   ├── schemaTypes/
│   │   ├── productType.ts       # Product schema
│   │   ├── orderType.ts         # Order schema
│   │   ├── categoryType.ts      # Category schema
│   │   └── customerType.ts      # Customer schema
│   ├── queries/                 # GROQ queries
│   ├── lib/
│   │   └── client.ts            # Sanity client
│   └── env.ts                   # Sanity config
├── public/                      # Static assets
├── .env.local                   # Environment variables (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
├── Dockerfile                   # Docker configuration
├── cloudbuild.yaml              # Google Cloud Build
├── next.config.ts               # Next.js config
├── sanity.config.ts             # Sanity Studio config
├── biome.json                   # Biome linter config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json
```

---

## 🤖 AI Shopping Agent

### How It Works

The AI agent uses a **Tool Loop Agent** pattern with context-aware capabilities:

1. **User sends message** - Natural language query
2. **Agent analyzes intent** - Determines which tool(s) to use
3. **Tool execution** - Calls Sanity API with parameters
4. **Response generation** - Formats results in conversational style
5. **Streaming response** - Real-time text streaming to UI

### Available Tools

#### 1. `searchProducts`

Search and filter furniture products.

**Parameters:**
- `query` (string) - Text search across name and description
- `category` (string) - Filter by category slug (e.g., "sofas", "tables")
- `material` (enum) - wood, metal, fabric, leather, glass
- `color` (enum) - black, white, oak, walnut, grey, natural
- `minPrice` / `maxPrice` (number) - Price range in GBP

**Example:**
```typescript
searchProducts({
  query: "dining",
  category: "tables",
  material: "wood",
  maxPrice: 500
})
```

#### 2. `getMyOrders`

Retrieve authenticated user's order history.

**Parameters:**
- `status` (enum) - pending, paid, shipped, delivered, cancelled

**Requires:** User authentication via Clerk

**Example:**
```typescript
getMyOrders({ status: "shipped" })
```

### AI Instructions

The agent follows detailed instructions for:
- **Product search strategies** - Category-first, then apply filters
- **Stock awareness** - Warn about low/out of stock items
- **Similar recommendations** - Suggest alternatives for out-of-stock items
- **Order status communication** - Use emojis for status indicators
- **Authentication handling** - Prompt sign-in for order tracking

---

## 🎨 UI Components

### Design System

- **OKLCH Color Space** - Perceptually uniform colors
- **Dark Mode** - System preference detection + manual toggle
- **Custom CSS Variables** - Theme tokens for consistency
- **Responsive Breakpoints** - Mobile-first approach
- **Accessibility** - WCAG 2.1 AA compliant

### Key Components

**Customer-Facing:**
- `Header` - Navigation with cart/chat/auth buttons
- `FeaturedCarousel` - Auto-playing product showcase
- `CategoryTiles` - Category navigation grid
- `ProductGrid` - Filterable product listing
- `ProductCard` - Product preview with stock badge
- `ProductGallery` - Multi-image viewer
- `CartSheet` - Slide-out shopping cart
- `ChatSheet` - AI assistant interface

**Admin:**
- `StatCard` - Dashboard metric cards
- `RecentOrders` - Order list with quick actions
- `ProductRow` / `OrderRow` - Table row components
- `ImageUploader` - Drag-and-drop image upload
- `StatusSelect` - Order status dropdown

**Chat UI:**
- `MessageBubble` - Chat message styling
- `ToolCallUI` - Loading states for AI tools
- `ProductCardWidget` - Product cards in chat
- `OrderCardWidget` - Order cards in chat

---

## 🔐 Security Features

### Authentication
- ✅ Clerk authentication with social login support
- ✅ Server-side session validation on protected routes
- ✅ Role-based access control (customer vs admin)
- ✅ Secure API endpoints with auth middleware

### Payment Security
- ✅ PCI-compliant Stripe integration
- ✅ Server-side checkout session creation
- ✅ Webhook signature verification
- ✅ No card data stored on server

### Data Protection
- ✅ Environment variables for sensitive data
- ✅ Server-only secrets (not exposed to client)
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React auto-escaping)

---

## 📊 Data Models

### Product Schema

```typescript
{
  _type: 'product',
  name: string,                    // Product name
  slug: { current: string },       // URL-friendly slug
  description: text,               // Rich text description
  price: number,                   // Price in GBP
  category: reference,             // Reference to category
  material: enum,                  // wood | metal | fabric | leather | glass
  color: enum,                     // black | white | oak | walnut | grey | natural
  dimensions: string,              // e.g., "120cm x 80cm x 75cm"
  images: image[],                 // Array of images
  stock: number,                   // Current inventory count
  featured: boolean,               // Show in carousel
  assemblyRequired: boolean        // Assembly needed
}
```

### Order Schema

```typescript
{
  _type: 'order',
  orderNumber: string,             // Auto-generated (ORD-XXXXX)
  customer: reference,             // Reference to customer
  clerkUserId: string,             // Clerk user ID
  stripeSessionId: string,         // Stripe checkout session
  items: [{
    product: reference,
    quantity: number,
    price: number
  }],
  total: number,                   // Total amount in GBP
  status: enum,                    // pending | paid | shipped | delivered | cancelled
  shippingAddress: {
    name: string,
    line1: string,
    line2?: string,
    city: string,
    postal_code: string,
    country: string
  },
  createdAt: datetime,
  updatedAt: datetime
}
```

### Category Schema

```typescript
{
  _type: 'category',
  title: string,                   // Category name
  slug: { current: string },       // URL slug
  description: text                // Category description
}
```

### Customer Schema

```typescript
{
  _type: 'customer',
  clerkUserId: string,             // Clerk user ID
  stripeCustomerId: string,        // Stripe customer ID
  email: string,                   // Customer email
  name: string                     // Customer name
}
```

---

## 🎬 Demo

### Live Application

**🌐 Cloud Run Deployment:** [https://ai-ecommerce-app-1093867341671.asia-south1.run.app](https://ai-ecommerce-app-1093867341671.asia-south1.run.app)

**Features to Try:**
- 🤖 **AI Shopping Assistant** - Click the chat icon and ask questions like:
  - "Show me wooden dining tables under £500"
  - "I need a grey sofa for a small living room"
  - "What's the status of my order?" (requires sign-in)
- 🛍️ **Browse Products** - Explore the furniture catalog with filters
- 🛒 **Shopping Cart** - Add items and proceed to checkout
- 👨‍💼 **Admin Dashboard** - Sign in to access `/admin` (admin role required)
- 🎨 **Dark Mode** - Toggle between light and dark themes

**Test Credentials:**
- Use any email to sign up via Clerk authentication
- Stripe test mode is enabled - use card `4242 4242 4242 4242`

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t ai-ecommerce-app .

# Run container locally
docker run -p 3000:3000 --env-file .env.local ai-ecommerce-app
```

### Google Cloud Run

```bash
# Build and deploy
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly
gcloud run deploy ai-ecommerce-app \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables Setup

**Required for deployment:**
1. Add all `.env.local` variables to your deployment platform
2. Update `NEXT_PUBLIC_BASE_URL` to your production URL
3. Configure Stripe webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
4. Update Clerk redirect URLs
5. Configure Sanity CORS origins

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User authentication (sign up, sign in, sign out)
- [ ] Product search with AI assistant
- [ ] Add to cart and update quantities
- [ ] Checkout flow with Stripe
- [ ] Order creation after payment
- [ ] Order tracking via AI chat
- [ ] Admin inventory management
- [ ] Admin order fulfillment
- [ ] Dark mode toggle
- [ ] Mobile responsiveness

### Future Testing Plans

- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright
- API tests with Supertest

---

## 🎯 Roadmap

### Phase 1: Core Features ✅ (Completed)
- [x] AI shopping assistant
- [x] Product catalog with filters
- [x] Shopping cart with persistence
- [x] Stripe checkout integration
- [x] Order management system
- [x] Admin dashboard
- [x] Dark mode support

### Phase 2: Enhancements 🚧 (In Progress)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications (order confirmations, shipping updates)
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard

### Phase 3: Advanced Features 📋 (Planned)
- [ ] Product recommendations ML model
- [ ] Live chat support
- [ ] Loyalty program
- [ ] Gift cards
- [ ] Bulk order discounts
- [ ] International shipping rates

### Phase 4: Scaling 🔮 (Future)
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Redis caching
- [ ] CDN optimization
- [ ] A/B testing framework

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Coding Standards

- Use TypeScript for all new files
- Follow the existing code style (enforced by Biome)
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Update documentation as needed

---

## 📝 License

This project is **private and proprietary**. All rights reserved.

---

## 👨‍💻 Author

**Kaushik**

- GitHub: [@Kaushik3131](https://github.com/Kaushik3131)
- LinkedIn: [Add your LinkedIn profile]
- Portfolio: [Add your portfolio website]

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Vercel](https://vercel.com/) - AI SDK and deployment platform
- [Sanity](https://www.sanity.io/) - Headless CMS
- [Stripe](https://stripe.com/) - Payment processing
- [Clerk](https://clerk.com/) - Authentication
- [Google AI](https://ai.google.dev/) - Gemini language model
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

---

## 📧 Support

For questions or support, please:
- Open an issue on GitHub
- Contact via email: [your-email@example.com]
- Check the [documentation](#) (add link when available)

---

<div align="center">

**Built with ❤️ using Next.js 16, React 19, and Google Gemini AI**

⭐ Star this repo if you find it helpful!

</div>