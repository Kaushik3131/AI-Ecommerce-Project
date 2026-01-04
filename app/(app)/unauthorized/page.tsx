import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-md space-y-6 p-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Access Denied
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            You don't have permission to access the admin panel. Please contact
            an administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/auth/signout">Sign Out</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
