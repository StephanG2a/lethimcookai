import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

// Définition locale de l'enum UserRole pour éviter les problèmes d'import
const UserRole = {
  CLIENT: "CLIENT",
  PRESTATAIRE: "PRESTATAIRE",
  ADMIN: "ADMIN",
} as const;

type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = "CLIENT",
    } = body;

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email et mot de passe requis",
        },
        { status: 400 }
      );
    }

    // Validation du format email
    if (!AuthUtils.isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'email invalide",
        },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    const passwordValidation = AuthUtils.isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: passwordValidation.message,
        },
        { status: 400 }
      );
    }

    // Validation du rôle
    const validRoles = Object.values(UserRole);
    console.log("Roles disponibles:", validRoles);
    console.log("Role fourni:", role);

    if (role && !validRoles.includes(role as UserRoleType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Rôle invalide. Rôles acceptés: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Un compte avec cet email existe déjà",
        },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        phone: phone?.trim() || null,
        role: role as UserRoleType,
        emailVerified: false,
      },
    });

    // Générer le token JWT
    const token = AuthUtils.generateToken(user);

    // Retourner les informations utilisateur (sans le mot de passe)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      organization: null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès",
        token,
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    );
  }
}
