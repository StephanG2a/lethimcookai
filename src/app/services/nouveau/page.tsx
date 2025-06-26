"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/useAuth";
import {
  Upload,
  Plus,
  X,
  MapPin,
  Clock,
  Euro,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const categories = [
  "Photographie",
  "Marketing",
  "Développement",
  "Design",
  "Formation",
  "SEO",
  "Gastronomie",
  "Consulting",
  "Événementiel",
  "Rédaction",
];

export default function NewServicePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    authenticatedFetch,
  } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    price: "",
    type: "ONLINE" as "IRL" | "ONLINE",
    duration: "",
    location: "",
    tags: [] as string[],
    replacedByAI: false,
    deliverables: [""],
    images: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifier l'authentification et le rôle
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/services/nouveau");
      return;
    }

    if (!authLoading && isAuthenticated && user?.role !== "PRESTATAIRE") {
      router.push("/services");
      return;
    }
  }, [isAuthenticated, authLoading, user, router]);

  // Afficher un écran de chargement pendant la vérification d'authentification
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">
                Vérification des permissions...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si pas authentifié ou pas prestataire, on ne rend rien
  if (!isAuthenticated || user?.role !== "PRESTATAIRE") {
    return null;
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData((prev) => ({ ...prev, deliverables: newDeliverables }));
  };

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, ""],
    }));
  };

  const removeDeliverable = (index: number) => {
    if (formData.deliverables.length > 1) {
      setFormData((prev) => ({
        ...prev,
        deliverables: prev.deliverables.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim())
      newErrors.description = "La description courte est requise";
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = "La description détaillée est requise";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Le prix doit être supérieur à 0";
    if (!formData.duration.trim()) newErrors.duration = "La durée est requise";
    if (formData.type === "IRL" && !formData.location.trim())
      newErrors.location =
        "La localisation est requise pour les services présentiels";
    if (formData.tags.length === 0)
      newErrors.tags = "Sélectionnez au moins un tag";
    if (formData.deliverables.some((d) => !d.trim()))
      newErrors.deliverables = "Tous les livrables doivent être renseignés";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch("/api/services/create", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fullDescription: formData.fullDescription,
          price: formData.price,
          duration: formData.duration,
          type: formData.type,
          location: formData.location,
          tags: formData.tags,
          deliverables: formData.deliverables,
          replacedByAI: formData.replacedByAI,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Service créé avec succès !");
        router.push(`/services/${data.service.id}`);
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion au serveur" });
      console.error("Erreur création service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Créer un nouveau service
          </h1>
          <p className="text-lg text-neutral-600">
            Partagez votre expertise avec{" "}
            {user?.organization?.name || "la communauté culinaire"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.general}
              </p>
            </div>
          )}
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Décrivez votre service de manière claire et attractive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Titre du service *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Shooting photo culinaire professionnel"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description courte *</Label>
                <Textarea
                  id="description"
                  placeholder="Résumé de votre service en 1-2 phrases"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fullDescription">Description détaillée *</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Décrivez en détail votre service, le déroulement, ce qui est inclus..."
                  value={formData.fullDescription}
                  onChange={(e) =>
                    handleInputChange("fullDescription", e.target.value)
                  }
                  className={errors.fullDescription ? "border-red-500" : ""}
                  rows={8}
                />
                {errors.fullDescription && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.fullDescription}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Détails pratiques */}
          <Card>
            <CardHeader>
              <CardTitle>Détails pratiques</CardTitle>
              <CardDescription>
                Informations sur le prix, la durée et la modalité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">Prix (€) *</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="350"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      className={`pl-10 ${
                        errors.price ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="duration">Durée *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="duration"
                      placeholder="2 heures"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      className={`pl-10 ${
                        errors.duration ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.duration && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Type de service *</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="ONLINE"
                      checked={formData.type === "ONLINE"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="text-orange-600"
                    />
                    <span>En ligne</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="IRL"
                      checked={formData.type === "IRL"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="text-orange-600"
                    />
                    <span>Présentiel</span>
                  </label>
                </div>
              </div>

              {formData.type === "IRL" && (
                <div>
                  <Label htmlFor="location">Localisation *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="location"
                      placeholder="Paris et proche banlieue"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className={`pl-10 ${
                        errors.location ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.replacedByAI}
                    onChange={(e) =>
                      handleInputChange("replacedByAI", e.target.checked)
                    }
                    className="rounded text-orange-600"
                  />
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-purple-600" />
                    Ce service peut être remplacé par l'IA
                  </span>
                </label>
                <p className="text-sm text-neutral-500 mt-1">
                  Cochez cette case si votre service peut potentiellement être
                  automatisé par l'IA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
              <CardDescription>
                Sélectionnez les catégories qui correspondent à votre service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      formData.tags.includes(category) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              {errors.tags && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.tags}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Livrables */}
          <Card>
            <CardHeader>
              <CardTitle>Ce qui est inclus</CardTitle>
              <CardDescription>
                Listez ce que le client recevra à la fin de la prestation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Ex: 10-15 photos haute résolution"
                        value={deliverable}
                        onChange={(e) =>
                          handleDeliverableChange(index, e.target.value)
                        }
                      />
                    </div>
                    {formData.deliverables.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDeliverable(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDeliverable}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un livrable
                </Button>
              </div>
              {errors.deliverables && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.deliverables}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Ajoutez des images pour illustrer votre service (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                <p className="text-neutral-600 mb-2">
                  Glissez-déposez vos images ici ou cliquez pour les
                  sélectionner
                </p>
                <p className="text-sm text-neutral-500">
                  Formats acceptés: JPG, PNG, WebP • Taille max: 5MB
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  Choisir des fichiers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" size="lg">
              Enregistrer comme brouillon
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publication...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publier le service
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
