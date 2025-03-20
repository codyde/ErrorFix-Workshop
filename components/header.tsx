"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ShoppingCart, User, LogOut, Bug } from "lucide-react";
import { CartModal } from "@/components/cart-modal";
import { LoginDialog } from "@/components/login-dialog";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>

          <Link href="/" className="flex items-center space-x-2">
            <Bug className="h-6 w-6 text-red-500" />
            <span className="font-bold text-xl">ErrorFix</span>
          </Link>

          <nav className="hidden md:flex ml-10 space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-red-500",
                pathname === "/" ? "text-red-500" : "text-muted-foreground",
              )}
            >
              Home
            </Link>
            <Link
              href="/products/1"
              className={cn(
                "text-sm font-medium transition-colors hover:text-red-500",
                pathname.startsWith("/products")
                  ? "text-red-500"
                  : "text-muted-foreground",
              )}
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className={cn(
                "text-sm font-medium transition-colors hover:text-red-500",
                pathname === "/cart" ? "text-red-500" : "text-muted-foreground",
              )}
            >
              Cart
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-900 border-gray-800"
              >
                <DropdownMenuLabel className="text-red-500">
                  {user?.name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer flex items-center text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-2">
            <Link
              href="/"
              className={cn(
                "block py-2 text-sm font-medium",
                pathname === "/" ? "text-red-500" : "text-muted-foreground",
              )}
            >
              Home
            </Link>
            <Link
              href="/products/1"
              className={cn(
                "block py-2 text-sm font-medium",
                pathname.startsWith("/products")
                  ? "text-red-500"
                  : "text-muted-foreground",
              )}
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className={cn(
                "block py-2 text-sm font-medium",
                pathname === "/cart" ? "text-red-500" : "text-muted-foreground",
              )}
            >
              Cart
            </Link>
          </div>
        </div>
      )}

      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  );
}
