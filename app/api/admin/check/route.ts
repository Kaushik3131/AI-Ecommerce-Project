import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { ADMIN_USER_BY_CLERK_ID_QUERY } from "@/sanity/queries/adminUsers";

export async function GET() {
  try {
    // Get the current user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { isAdmin: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    // Check if user exists in Sanity admin users
    const adminUser = await client.fetch(ADMIN_USER_BY_CLERK_ID_QUERY, {
      clerkUserId: userId,
    });

    if (!adminUser) {
      return NextResponse.json(
        { isAdmin: false, error: "Not authorized as admin" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      isAdmin: true,
      user: adminUser,
    });
  } catch (error) {
    console.error("[Admin Check Error]:", error);
    return NextResponse.json(
      { isAdmin: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
