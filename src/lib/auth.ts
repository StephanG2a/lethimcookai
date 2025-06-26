import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthUtils {
  // Hasher un mot de passe
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Vérifier un mot de passe
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Générer un JWT token
  static generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  // Vérifier et décoder un JWT token
  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  // Valider le format email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Valider la force du mot de passe
  static isValidPassword(password: string): {
    valid: boolean;
    message?: string;
  } {
    if (password.length < 6) {
      return {
        valid: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      };
    }

    if (password.length > 100) {
      return {
        valid: false,
        message: "Le mot de passe ne peut pas dépasser 100 caractères",
      };
    }

    // Optionnel : ajouter plus de règles de complexité
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        valid: false,
        message:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
      };
    }

    return { valid: true };
  }

  // Extraire le token depuis les headers Authorization
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;

    return parts[1];
  }
}
