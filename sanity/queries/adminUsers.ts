// GROQ queries for admin user management

export const ADMIN_USER_BY_CLERK_ID_QUERY = `
  *[_type == "adminUser" && clerkUserId == $clerkUserId && isActive == true][0]{
    _id,
    email,
    name,
    role,
    isActive
  }
`;

export const ALL_ADMIN_USERS_QUERY = `
  *[_type == "adminUser" && isActive == true] | order(email asc){
    _id,
    email,
    name,
    role,
    isActive,
    clerkUserId
  }
`;
