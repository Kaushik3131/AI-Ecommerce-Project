import Link from "next/link";
import { ShieldAlert, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-4 w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Access Denied
          </h1>

          {/* Description */}
          <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
            You don't have permission to access the admin panel. Please contact
            an administrator if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>

            <SignOutButton>
              <Button variant="outline" className="w-full" size="lg">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </SignOutButton>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
            Only authorized admin users can access the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}
