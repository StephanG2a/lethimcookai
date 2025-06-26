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
    const loadAuthFromStorage = () => {
      try {
        const token = localStorage.getItem("auth_token");
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
    localStorage.setItem("auth_token", token);
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
    localStorage.removeItem("auth_token");
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
    const token = authState.token || localStorage.getItem("auth_token");

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
    const token = authState.token || localStorage.getItem("auth_token");

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
    ...authState,
    login,
    logout,
    checkProfile,
    authenticatedFetch,
  };
}
