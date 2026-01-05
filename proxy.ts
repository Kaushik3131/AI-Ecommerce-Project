import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { ADMIN_USER_BY_CLERK_ID_QUERY } from "@/sanity/queries/adminUsers";

const isProtectedRoute = createRouteMatcher([
  "/checkout",
  "/orders",
  "/orders/[id]",
  "/checkout/success",
  "/admin(.*)", // Protect all admin routes
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtectedRoute(req)) {
    // Require authentication for all protected routes
    if (!userId) {
      await auth.protect();
      return;
    }

    // Additional check for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      try {
        // Query Sanity directly instead of fetching API route
        const adminUser = await client.fetch(ADMIN_USER_BY_CLERK_ID_QUERY, {
          clerkUserId: userId,
        });

        if (!adminUser) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      } catch (error) {
        console.error("[Middleware Admin Check Error]:", error);
        // On error, redirect to unauthorized page for safety
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
