import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Zap, User } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    type: "IRL" | "ONLINE" | "MIXED";
    tags: string[];
    image?: string;
    location?: string;
    duration?: string;
    replacedByAI: boolean;
    provider: {
      name: string;
      avatar?: string;
      rating: number;
    };
  };
}

// Emojis pour les différents types de services
const getServiceEmoji = (tags: string[]) => {
  if (tags.includes("Photographie")) return "📸";
  if (tags.includes("Marketing")) return "📢";
  if (tags.includes("Développement")) return "💻";
  if (tags.includes("Design")) return "🎨";
  if (tags.includes("Formation")) return "📚";
  if (tags.includes("SEO")) return "🔍";
  if (tags.includes("Gastronomie")) return "👨‍🍳";
  return "🍽️";
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-neutral-200">
      <div className="relative">
        {service.image && service.image.startsWith("http") ? (
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-xl flex items-center justify-center">
            <div className="text-6xl">{getServiceEmoji(service.tags)}</div>
          </div>
        )}

        {/* Badge IA remplaçable */}
        {service.replacedByAI && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 border-purple-200"
            >
              <Zap className="h-3 w-3 mr-1" />
              IA Compatible
            </Badge>
          </div>
        )}

        {/* Badge type */}
        <div className="absolute top-3 left-3">
          <Badge variant={service.type === "IRL" ? "default" : "secondary"}>
            {service.type === "IRL"
              ? "Présentiel"
              : service.type === "ONLINE"
              ? "En ligne"
              : "Hybride"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
          {service.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {service.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{service.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Infos pratiques */}
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <div className="flex items-center space-x-4">
            {service.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="text-xs">{service.location}</span>
              </div>
            )}
            {service.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{service.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prestataire */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {service.provider.avatar &&
            service.provider.avatar.startsWith("http") ? (
              <Image
                src={service.provider.avatar}
                alt={service.provider.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4 text-neutral-400" />
            )}
            <span className="text-sm text-neutral-600">
              {service.provider.name}
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            ⭐ {service.provider.rating}/5
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex items-center justify-between">
        <div className="text-xl font-bold text-orange-600">
          {formatPrice(service.price)}
        </div>
        <Button asChild size="sm">
          <Link href={`/services/${service.id}`}>Voir détails</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
