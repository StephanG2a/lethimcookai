"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChefHat, Search, User, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <span className="text-xl font-bold text-neutral-900">
            LetHimCookAI
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/services"
            className="text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/prestataires"
            className="text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors"
          >
            Prestataires
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors"
          >
            Assistant IA
          </Link>
          <Link
            href="/comment-ca-marche"
            className="text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors"
          >
            Comment ça marche
          </Link>
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recherche">
              <Search className="h-4 w-4" />
              Rechercher
            </Link>
          </Button>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                // Menu utilisateur connecté
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-neutral-600">
                    Bonjour, {user?.firstName || user?.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                  {user?.role === "PRESTATAIRE" && (
                    <Button size="sm" asChild>
                      <Link href="/services/nouveau">
                        <Plus className="h-4 w-4" />
                        Publier un service
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                // Menu utilisateur non connecté
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/login">
                      <User className="h-4 w-4" />
                      Connexion
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register">
                      <Plus className="h-4 w-4" />
                      S'inscrire
                    </Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/services"
              className="block text-sm font-medium text-neutral-600 hover:text-orange-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/prestataires"
              className="block text-sm font-medium text-neutral-600 hover:text-orange-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Prestataires
            </Link>
            <Link
              href="/chat"
              className="block text-sm font-medium text-neutral-600 hover:text-orange-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Assistant IA
            </Link>
            <Link
              href="/comment-ca-marche"
              className="block text-sm font-medium text-neutral-600 hover:text-orange-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Comment ça marche
            </Link>
            <hr className="border-neutral-200" />
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href="/recherche">
                  <Search className="h-4 w-4" />
                  Rechercher
                </Link>
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    // Menu mobile utilisateur connecté
                    <>
                      <div className="p-2 text-sm text-neutral-600">
                        Connecté en tant que: {user?.firstName || user?.email}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </Button>
                      {user?.role === "PRESTATAIRE" && (
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href="/services/nouveau">
                            <Plus className="h-4 w-4" />
                            Publier un service
                          </Link>
                        </Button>
                      )}
                    </>
                  ) : (
                    // Menu mobile utilisateur non connecté
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/auth/login">
                          <User className="h-4 w-4" />
                          Connexion
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/auth/register">
                          <Plus className="h-4 w-4" />
                          S'inscrire
                        </Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
