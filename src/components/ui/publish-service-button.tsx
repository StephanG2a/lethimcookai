"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

interface PublishServiceButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function PublishServiceButton({
  variant = "outline",
  size = "lg",
  className = "",
  children,
}: PublishServiceButtonProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Ne pas afficher le bouton si l'utilisateur n'est pas connecté ou en cours de chargement
  if (!isAuthenticated || isLoading) {
    return null;
  }

  // Ne pas afficher le bouton si l'utilisateur n'est pas prestataire
  if (user?.role !== "PRESTATAIRE") {
    return null;
  }

  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href="/services/nouveau">
        {children || (
          <>
            Publier un service
            <ArrowRight className="h-5 w-5 ml-2" />
          </>
        )}
      </Link>
    </Button>
  );
}
