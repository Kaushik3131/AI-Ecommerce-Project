"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Armchair,
  Package,
  ShoppingBag,
  Sparkles,
  User,
  Menu,
  X,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";
import { useState, useEffect } from "react";

const prompts = [
  "Find a sofa under ₹50,000",
  "Where is my order?",
  "Best dining sets for 6",
  "Show me bedroom furniture",
  "Do you have diamond shiny chair?",
];

export function Header() {
  const pathname = usePathname();
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenuIcon, setShowMenuIcon] = useState(true);

  // Animate between logo and menu icon every second
  useEffect(() => {
    const interval = setInterval(() => {
      setShowMenuIcon((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex];
    let charIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < currentPrompt.length) {
        setDisplayedText(currentPrompt.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 80); // 80ms per character for smooth typing

    const promptTimeout = setTimeout(
      () => {
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
      },
      currentPrompt.length * 80 + 2000,
    ); // Wait 2s after typing completes

    return () => {
      clearInterval(typingInterval);
      clearTimeout(promptTimeout);
    };
  }, [currentPromptIndex]);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        {/* Left: Logo/Menu Toggle + Nav */}
        <div className="flex items-center gap-6">
          {/* Mobile: Animated Logo/Menu Icon */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-(--festive-primary) to-red-700 shadow-md transition-all lg:hidden"
          >
            <div className="relative h-6 w-6">
              <Armchair
                className={`absolute inset-0 h-6 w-6 text-white transition-all duration-300 ${
                  showMenuIcon ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
              />
              <Menu
                className={`absolute inset-0 h-6 w-6 text-white transition-all duration-300 ${
                  showMenuIcon ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
            </div>
          </button>

          {/* Desktop: Logo */}
          <Link href="/" className="hidden items-center gap-2 shrink-0 lg:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-(--festive-primary) to-red-700 shadow-md">
              <Armchair className="h-6 w-6 text-white" />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                FurnitureCo
              </span>
              <span className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-(--festive-primary)">
                Festive Edition
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className={`relative text-sm font-medium transition-all duration-300 ${
                isActive("/")
                  ? "scale-125 text-base font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent animate-pulse"
                  : "text-zinc-700 hover:text-amber-600 dark:text-zinc-300 dark:hover:text-amber-500"
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`relative text-sm font-medium transition-all duration-300 ${
                isActive("/shop")
                  ? "scale-125 text-base font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent animate-pulse"
                  : "text-zinc-700 hover:text-amber-600 dark:text-zinc-300 dark:hover:text-amber-500"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`relative text-sm font-medium transition-all duration-300 ${
                isActive("/about")
                  ? "scale-125 text-base font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent animate-pulse"
                  : "text-zinc-700 hover:text-amber-600 dark:text-zinc-300 dark:hover:text-amber-500"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`relative text-sm font-medium transition-all duration-300 ${
                isActive("/contact")
                  ? "scale-125 text-base font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent animate-pulse"
                  : "text-zinc-700 hover:text-amber-600 dark:text-zinc-300 dark:hover:text-amber-500"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Center: AI Shopping Assistant */}
        <div className="flex flex-1 justify-center px-4">
          {!isChatOpen && (
            <Button
              onClick={openChat}
              className="w-full max-w-md cursor-pointer justify-start gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200/50 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-300/50 dark:shadow-amber-900/30 dark:hover:shadow-amber-800/40"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden text-sm font-medium sm:inline">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </span>
            </Button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <ModeToggle />

          {/* My Orders - Only when signed in */}
          <SignedIn>
            <Button asChild className="hidden md:flex">
              <Link href="/orders" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">My Orders</span>
              </Link>
            </Button>
          </SignedIn>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className="sr-only">Open cart ({totalItems} items)</span>
          </Button>

          {/* User */}
          <SignedIn>
            <UserButton
              afterSwitchSessionUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<Package className="h-4 w-4" />}
                  href="/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
          <nav className="flex flex-col px-4 py-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                isActive("/")
                  ? "bg-(--festive-primary)/10 text-(--festive-primary)"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                isActive("/shop")
                  ? "bg-(--festive-primary)/10 text-(--festive-primary)"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                isActive("/about")
                  ? "bg-(--festive-primary)/10 text-(--festive-primary)"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                isActive("/contact")
                  ? "bg-(--festive-primary)/10 text-(--festive-primary)"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
