"use client";

import Link from "next/link";
import { ChefHat, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

export function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto max-w-screen-xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">LetHimCookAI</span>
            </Link>
            <p className="text-sm text-neutral-400">
              La plateforme qui connecte les professionnels de la gastronomie
              avec les meilleurs prestataires du secteur.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="hover:text-orange-500 transition-colors"
                >
                  Parcourir les services
                </Link>
              </li>
              {user?.role === "PRESTATAIRE" && (
                <li>
                  <Link
                    href="/services/nouveau"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Publier un service
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/prestataires"
                  className="hover:text-orange-500 transition-colors"
                >
                  Devenir prestataire
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/comment-ca-marche"
                  className="hover:text-orange-500 transition-colors"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-orange-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-orange-500 transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>contact@lethimcookai.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">
            © 2025 LetHimCookAI. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/mentions-legales"
              className="text-sm text-neutral-400 hover:text-orange-500 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-sm text-neutral-400 hover:text-orange-500 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/cgu"
              className="text-sm text-neutral-400 hover:text-orange-500 transition-colors"
            >
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
