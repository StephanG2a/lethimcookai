import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Euro,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  summary: string | null;
  lowerPrice: number;
  upperPrice: number;
  paymentMode: string;
  tags: string[];
}

interface Organization {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  sector: string;
  siret: string | null;
  legalForm: string | null;
  servicesCount: number;
  services: Service[];
}

interface Prestataire {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  createdAt: string;
  organization: Organization | null;
}

interface PrestataireCardProps {
  prestataire: Prestataire;
}

export function PrestataireCard({ prestataire }: PrestataireCardProps) {
  const fullName = [prestataire.firstName, prestataire.lastName]
    .filter(Boolean)
    .join(" ");

  const displayName = fullName || prestataire.email.split("@")[0];
  const joinDate = new Date(prestataire.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-neutral-200 hover:border-orange-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-orange-700">
                {(fullName || prestataire.email)[0].toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg text-neutral-900">
                {displayName}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={prestataire.emailVerified ? "default" : "outline"}
                  className="text-xs"
                >
                  {prestataire.emailVerified ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {prestataire.emailVerified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-neutral-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Depuis {joinDate}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informations de contact */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-neutral-600">
            <Mail className="w-4 h-4 mr-2 text-neutral-400" />
            {prestataire.email}
          </div>
          {prestataire.phone && (
            <div className="flex items-center text-sm text-neutral-600">
              <Phone className="w-4 h-4 mr-2 text-neutral-400" />
              {prestataire.phone}
            </div>
          )}
        </div>

        {/* Organisation */}
        {prestataire.organization ? (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-neutral-900 flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-orange-500" />
                {prestataire.organization.name}
              </h4>
              <Badge variant="secondary" className="text-xs">
                {prestataire.organization.sector}
              </Badge>
            </div>

            {prestataire.organization.description && (
              <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                {prestataire.organization.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 mb-3">
              {prestataire.organization.legalForm && (
                <div>Forme juridique: {prestataire.organization.legalForm}</div>
              )}
              {prestataire.organization.siret && (
                <div>SIRET: {prestataire.organization.siret}</div>
              )}
              {prestataire.organization.address && (
                <div className="flex items-center col-span-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {prestataire.organization.address}
                </div>
              )}
            </div>

            {/* Services */}
            {prestataire.organization.services.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-neutral-700">
                    Services proposés
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {prestataire.organization.servicesCount} service
                    {prestataire.organization.servicesCount > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {prestataire.organization.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-neutral-50 rounded-lg p-3 border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-neutral-900 mb-1">
                            {service.title}
                          </h5>
                          {service.summary && (
                            <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                              {service.summary}
                            </p>
                          )}
                          {service.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {service.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-2 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {service.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0"
                                >
                                  +{service.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-sm font-semibold text-neutral-900">
                            {service.lowerPrice === service.upperPrice
                              ? `${service.lowerPrice}€`
                              : `${service.lowerPrice}€ - ${service.upperPrice}€`}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {service.paymentMode}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t">
              {prestataire.organization.website && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={prestataire.organization.website} target="_blank">
                    <Globe className="w-4 h-4 mr-1" />
                    Site web
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/organizations/${prestataire.organization.id}`}>
                  <Building2 className="w-4 h-4 mr-1" />
                  Voir l'organisation
                </Link>
              </Button>
              {prestataire.organization.email && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`mailto:${prestataire.organization.email}`}>
                    <Mail className="w-4 h-4 mr-1" />
                    Contacter
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-500">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p className="text-sm">Aucune organisation associée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
