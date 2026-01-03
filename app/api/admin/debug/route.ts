import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const { userId } = await auth();

    // Get all admin users from Sanity
    const allAdmins = await client.fetch(`
      *[_type == "adminUser"]{
        _id,
        email,
        name,
        clerkUserId,
        isActive,
        role
      }
    `);

    return NextResponse.json({
      clerkUserId: userId,
      totalAdmins: allAdmins.length,
      admins: allAdmins,
      message:
        "Compare your Clerk User ID with the clerkUserId in the list above",
    });
  } catch (error) {
    console.error("[Debug Error]:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
