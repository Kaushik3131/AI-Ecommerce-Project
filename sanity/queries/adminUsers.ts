import { groq } from "next-sanity";

// Check if a user is an admin
export const ADMIN_USER_BY_CLERK_ID_QUERY = groq`
  *[_type == "adminUser" && clerkUserId == $clerkUserId && isActive == true][0]{
    _id,
    email,
    name,
    role,
    isActive,
    createdAt
  }
`;

// Get all admin users
export const ALL_ADMIN_USERS_QUERY = groq`
  *[_type == "adminUser"] | order(createdAt desc){
    _id,
    email,
    name,
    role,
    isActive,
    clerkUserId,
    createdAt
  }
`;
