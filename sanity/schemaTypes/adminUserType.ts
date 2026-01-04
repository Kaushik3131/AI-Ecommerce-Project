import { defineField, defineType } from "sanity";

export const adminUserType = defineType({
  name: "adminUser",
  title: "Admin User",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      description: "The Clerk user ID for authentication",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Editor", value: "editor" },
        ],
      },
      initialValue: "admin",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      description: "Whether this admin user can access the admin panel",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "role",
    },
  },
});
