"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  organization: {
    id: string;
    name: string;
    sector: string;
  } | null;
  // Système d'abonnements
  subscriptionPlan: "FREE" | "PREMIUM" | "BUSINESS";
  subscriptionStatus: "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  trialUsed: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Charger les données d'authentification depuis localStorage
    const loadAuthFromStorage = async () => {
      try {
        // Vérifier d'abord avec le token "token" (utilisé dans l'app)
        let token = localStorage.getItem("token");
        if (!token) {
          // Fallback vers "auth_token"
          token = localStorage.getItem("auth_token");
        }

        const userDataString = localStorage.getItem("user_data");

        if (token && userDataString) {
          const userData = JSON.parse(userDataString);
          setAuthState({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'authentification:",
          error
        );
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    loadAuthFromStorage();
  }, []);

  // Fonction de connexion
  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_data", JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token"); // Nettoyer aussi l'ancien
    localStorage.removeItem("user_data");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Vérifier le profil utilisateur (avec appel API)
  const checkProfile = async () => {
    let token = authState.token || localStorage.getItem("token");
    if (!token) {
      token = localStorage.getItem("auth_token"); // Fallback
    }

    if (!token) {
      logout();
      return false;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          login(token, data.user);
          return true;
        }
      }

      // Token invalide, déconnecter
      logout();
      return false;
    } catch (error) {
      console.error("Erreur lors de la vérification du profil:", error);
      logout();
      return false;
    }
  };

  // Fonction pour faire des appels API authentifiés
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    let token = authState.token || localStorage.getItem("token");
    if (!token) {
      token = localStorage.getItem("auth_token"); // Fallback
    }

    if (!token) {
      throw new Error("Non authentifié");
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.isLoading, // Alias pour compatibilité
    isLoading: authState.isLoading,
    login,
    logout,
    checkProfile,
    authenticatedFetch,
  };
}
