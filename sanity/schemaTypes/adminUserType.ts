import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const adminUserType = defineType({
  name: "adminUser",
  title: "Admin Users",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
      description: "Email address of the admin user (must match Clerk email)",
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Clerk user ID (from Clerk dashboard)",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Super Admin", value: "super_admin" },
          { title: "Admin", value: "admin" },
          { title: "Editor", value: "editor" },
        ],
        layout: "radio",
      },
      initialValue: "admin",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
      description: "Deactivate to revoke admin access",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      isActive: "isActive",
      role: "role",
    },
    prepare({ title, subtitle, isActive, role }) {
      return {
        title: `${title} ${!isActive ? "(Inactive)" : ""}`,
        subtitle: `${subtitle} • ${role}`,
      };
    },
  },
});
