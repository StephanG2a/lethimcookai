"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChefHat,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Phone,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "CLIENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmez votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || null,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Stocker le token dans localStorage
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));

        alert("Compte créé avec succès !");
        router.push("/services"); // Rediriger vers la page d'accueil
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion au serveur" });
      console.error("Erreur inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Rejoindre LetHimCookAI
            </h1>
            <p className="text-neutral-600">
              Créez votre compte pour accéder à tous nos services
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
              <CardDescription>
                Remplissez les informations ci-dessous pour créer votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.general}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`pl-10 ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`pl-10 ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean.dupont@email.fr"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`pl-10 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`pl-10 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`pl-10 pr-10 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="role">Type de compte</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="PRESTATAIRE">Prestataire</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création du compte...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-neutral-600">
                  Vous avez déjà un compte ?{" "}
                </span>
                <Link
                  href="/auth/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              En créant un compte, vous acceptez nos{" "}
              <Link
                href="/cgu"
                className="text-orange-600 hover:text-orange-700"
              >
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link
                href="/politique-confidentialite"
                className="text-orange-600 hover:text-orange-700"
              >
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
