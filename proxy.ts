import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
        // Call our admin check API
        const checkUrl = new URL("/api/admin/check", req.url);
        const response = await fetch(checkUrl, {
          headers: {
            Cookie: req.headers.get("cookie") || "",
          },
        });

        const data = await response.json();

        if (!data.isAdmin) {
          // Redirect to unauthorized page
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
