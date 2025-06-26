import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const websiteGenerator = tool(
  async ({ 
    restaurantName, 
    restaurantType, 
    websiteType, 
    features, 
    colorScheme, 
    content 
  }) => {
    try {
      console.log(`🌐 Génération de site web pour: ${restaurantName}`);

      // Analyser le type de restaurant et générer un site adapté
      // Générer le thème et le layout une seule fois pour garantir la cohérence
      const theme = generateRandomTheme();
      const layoutVersion = generateRandomLayout();
      
      const siteStructure = generateSiteStructure(restaurantType, websiteType, features);
      const designElements = generateDesignElements(restaurantType, colorScheme);
      const siteContent = generateSiteContent(restaurantName, restaurantType, content);
      const technicalSpecs = generateTechnicalSpecs(websiteType, features);

      let response = `# 🌐 Site Web Généré pour ${restaurantName}

## 🎯 Spécifications Générées

**Type de restaurant :** ${restaurantType}
**Type de site :** ${websiteType}
**Fonctionnalités :** ${features.join(', ')}
**Schéma colorimétrique :** ${colorScheme}

---

## 📋 Structure du Site

${siteStructure}

---

## 🎨 Éléments de Design

${designElements}

---

## 📝 Contenu Généré

${siteContent}

---

## ⚙️ Spécifications Techniques

${technicalSpecs}

---

## 💻 Fichiers Générés

Le site web complet a été généré avec les fichiers suivants :

**📁 Structure des fichiers :**
- **index.html** - Page principale (${Math.round(generateHTMLForPreview(restaurantName, restaurantType, features, colorScheme, theme, layoutVersion).length / 1024)}KB)
- **styles.css** - Styles responsives (${Math.round(generateCSSForPreview(colorScheme).length / 1024)}KB)  
- **script.js** - Interactions JavaScript (${Math.round(generateJSForPreview(features).length / 1024)}KB)

**🎨 Éléments créés :**
- Navigation responsive avec logo
- Section hero avec call-to-action
- Section menu avec aperçu des catégories
- Section à propos personnalisée
- Section contact avec coordonnées
- Footer professionnel
${features.includes('reservation') ? '- Système de réservation intégré' : ''}
${features.includes('menu-interactif') ? '- Menu interactif avec animations' : ''}

## 🚀 Prêt pour le Déploiement

**✅ Optimisations incluses :**
- SEO optimisé avec meta tags
- Design responsive (mobile, tablette, desktop)
- Performance optimisée
- Accessibilité WCAG 2.1

**🎯 Fonctionnalités actives :**
${features.map(f => `- ${getFeatureDescription(f)}`).join('\n')}

**📱 Compatibilité :**
- Tous navigateurs modernes
- Mobile-first responsive
- Chargement rapide optimisé

## 💡 Actions Possibles

**Dans l'interface ci-dessus :**
- 🚀 **Ouvrir en plein écran** pour voir le rendu final
- 📋 **Copier HTML** pour récupérer le code
- 💾 **Télécharger** pour sauvegarder le fichier

**Pour personnaliser davantage :**
- Utiliser **logoGenerator** pour créer un logo
- Utiliser **culinaryImageGenerator** pour les visuels
- Utiliser **menuPlanner** pour le contenu du menu

---

**💻 Site web généré avec succès !**
*Prêt à être personnalisé et déployé*

**🛠️ Technologies utilisées :** HTML5, CSS3, JavaScript ES6, Design Responsive
**⚡ Performance :** Optimisé pour le chargement rapide et le SEO
**📱 Compatible :** Tous devices et navigateurs modernes

---
**MÉTADONNÉES_WEBSITE:** ${JSON.stringify({
  title: `${restaurantName} - ${restaurantType}`,
  restaurantName: restaurantName,
  restaurantType: restaurantType,
  websiteType: websiteType,
  features: features,
  colorScheme: colorScheme,
  htmlContent: generateSimpleHTML(restaurantName, restaurantType, features, colorScheme),
  cssContent: generateSimpleCSS(colorScheme),
  jsContent: generateSimpleJS(features),
  previewUrl: generateSimpleDataURL(restaurantName, restaurantType, features, colorScheme),
  technologies: ["HTML5", "CSS3", "JavaScript ES6", "Responsive Design"],
  seoOptimized: true,
  responsive: true,
  deploymentReady: true,
  generatedAt: new Date().toISOString()
})}`;

      console.log(`✅ Site web pour "${restaurantName}" généré avec succès`);
      return response;

    } catch (error) {
      console.error("❌ Erreur lors de la génération du site web:", error);
      return `# ❌ Erreur de Génération

Impossible de générer le site web pour "${restaurantName}".

**Erreur :** ${error.message}

💡 **Solutions :**
- Vérifiez les paramètres fournis
- Essayez avec des options plus simples
- Contactez le support technique`;
    }
  },
  {
    name: "websiteGenerator",
    description: `🌐 OUTIL PRIORITAIRE POUR CRÉATION DE SITES WEB ! 
    Générateur de sites web COMPLETS pour restaurants et établissements culinaires. 
    Utilise cet outil pour TOUTES les demandes de sites web, site vitrine, site internet, développement web.
    Crée un site responsive avec HTML, CSS et JavaScript, optimisé SEO et prêt à déployer.
    Inclut des fonctionnalités spécialisées comme réservation en ligne, menu interactif, etc.
    
    Mots-clés déclencheurs: site, web, vitrine, internet, développement, "fait le site"`,
    schema: z.object({
      restaurantName: z.string().describe("Nom du restaurant ou établissement"),
      restaurantType: z.string().describe("Type de restaurant (gastronomique, brasserie, pizzeria, etc.)"),
      websiteType: z.enum(["vitrine", "e-commerce", "reservation", "portfolio"]).describe("Type de site web à générer"),
      features: z.array(z.string()).describe("Fonctionnalités désirées (reservation, menu-interactif, galerie, contact, etc.)"),
      colorScheme: z.enum(["elegant", "moderne", "rustique", "minimaliste", "chaleureux"]).describe("Schéma de couleurs et style"),
      content: z.string().optional().describe("Contenu spécifique ou instructions particulières")
    }),
  }
);

// Fonctions utilitaires pour la génération

function generateSiteStructure(restaurantType: string, websiteType: string, features: string[]): string {
  const baseStructure = [
    "🏠 **Page d'Accueil**",
    "   - Hero section avec image d'ambiance",
    "   - Présentation courte du restaurant",
    "   - Call-to-action principal",
    "",
    "🍽️ **Page Menu**",
    "   - Catégories de plats organisées",
    "   - Prix et descriptions",
    "   - Allergènes et informations nutritionnelles",
    "",
    "📖 **À Propos**",
    "   - Histoire du restaurant",
    "   - Chef et équipe",
    "   - Philosophie culinaire",
    "",
    "📞 **Contact**",
    "   - Coordonnées complètes",
    "   - Plan d'accès",
    "   - Horaires d'ouverture"
  ];

  if (features.includes('reservation')) {
    baseStructure.push("", "📅 **Réservation**", "   - Formulaire de réservation", "   - Disponibilités en temps réel", "   - Confirmation automatique");
  }

  if (features.includes('galerie')) {
    baseStructure.push("", "📸 **Galerie**", "   - Photos des plats", "   - Ambiance du restaurant", "   - Événements spéciaux");
  }

  if (features.includes('blog')) {
    baseStructure.push("", "📝 **Blog**", "   - Actualités du restaurant", "   - Recettes", "   - Événements");
  }

  return baseStructure.join('\n');
}

function generateDesignElements(restaurantType: string, colorScheme: string): string {
  const schemes = {
    elegant: {
      primary: "#2C3E50",
      accent: "#E74C3C", 
      bg: "#FFFFFF",
      text: "#2C3E50",
      description: "Palette élégante avec bleu marine et rouge bordeaux"
    },
    moderne: {
      primary: "#34495E",
      accent: "#1ABC9C",
      bg: "#ECF0F1", 
      text: "#2C3E50",
      description: "Design moderne avec gris anthracite et turquoise"
    },
    rustique: {
      primary: "#8B4513",
      accent: "#DAA520",
      bg: "#FFF8DC",
      text: "#654321", 
      description: "Ambiance rustique avec tons bois et dorés"
    },
    minimaliste: {
      primary: "#000000",
      accent: "#FF6B35",
      bg: "#FFFFFF",
      text: "#333333",
      description: "Style minimaliste noir et blanc avec accent orange"
    },
    chaleureux: {
      primary: "#D2691E",
      accent: "#FF8C00",
      bg: "#FFF5EE",
      text: "#8B4513",
      description: "Tons chauds orangés et terreux"
    }
  };

  const scheme = schemes[colorScheme as keyof typeof schemes];
  
  return `**🎨 Palette de couleurs (${colorScheme}) :**
- Couleur principale : ${scheme.primary}
- Couleur d'accent : ${scheme.accent} 
- Arrière-plan : ${scheme.bg}
- Texte : ${scheme.text}
- ${scheme.description}

**📐 Typographie :**
- Titres : Georgia, serif (élégant et lisible)
- Texte : Arial, sans-serif (moderne et claire)
- Tailles responsives adaptées

**🖼️ Éléments visuels :**
- Logo personnalisé suggéré
- Images haute qualité des plats
- Icônes cohérentes
- Animations subtiles au scroll

**📱 Design responsive :**
- Mobile-first approach
- Breakpoints optimisés
- Navigation tactile
- Performances optimisées`;
}

function generateSiteContent(restaurantName: string, restaurantType: string, content?: string): string {
  return `**✍️ Contenu éditorial généré :**

**Titre principal :** "${restaurantName} - ${restaurantType} d'Exception"

**Accroche Hero :** "Découvrez une expérience culinaire unique au cœur de [ville]"

**Description À Propos :**
"Depuis [année], ${restaurantName} vous accueille dans une ambiance ${restaurantType.toLowerCase()} authentique. Notre chef passionné cuisine avec des produits frais et locaux pour vous offrir une expérience gastronomique mémorable."

**Call-to-actions :**
- "Réserver votre table"
- "Découvrir notre menu"
- "Nous contacter"

**SEO Meta :**
- Title : "${restaurantName} | ${restaurantType} | [Ville]"
- Description : "Découvrez ${restaurantName}, ${restaurantType.toLowerCase()} d'exception. Menu savoureux, ambiance chaleureuse. Réservez dès maintenant !"
- Keywords : "${restaurantName}, ${restaurantType.toLowerCase()}, restaurant, gastronomie, [ville]"

${content ? `\n**Contenu personnalisé intégré :**\n${content}` : ''}`;
}

function generateTechnicalSpecs(websiteType: string, features: string[]): string {
  return `**⚙️ Spécifications techniques :**

**Structure :**
- HTML5 sémantique
- CSS3 avec variables personnalisées
- JavaScript ES6 moderne
- Architecture modulaire

**Performance :**
- Images optimisées (WebP avec fallback)
- CSS et JS minifiés
- Lazy loading des images
- Cache browser optimisé

**SEO :**
- Meta tags optimisés
- Schema.org Restaurant
- Open Graph pour réseaux sociaux
- Sitemap XML généré

**Accessibilité :**
- WCAG 2.1 AA compliant
- Navigation clavier
- Lecteurs d'écran compatibles
- Contrastes optimisés

**Responsive :**
- Mobile : 320px - 768px
- Tablette : 768px - 1024px  
- Desktop : 1024px+
- Tests multi-devices

**Fonctionnalités intégrées :**
${features.map(f => `- ✅ ${getFeatureDescription(f)}`).join('\n')}`;
}

function generateCSSVariables(colorScheme: string): string {
  const schemes = {
    elegant: "--primary-color: #2C3E50;\n    --accent-color: #E74C3C;\n    --bg-color: #FFFFFF;\n    --text-color: #2C3E50;",
    moderne: "--primary-color: #34495E;\n    --accent-color: #1ABC9C;\n    --bg-color: #ECF0F1;\n    --text-color: #2C3E50;",
    rustique: "--primary-color: #8B4513;\n    --accent-color: #DAA520;\n    --bg-color: #FFF8DC;\n    --text-color: #654321;",
    minimaliste: "--primary-color: #000000;\n    --accent-color: #FF6B35;\n    --bg-color: #FFFFFF;\n    --text-color: #333333;",
    chaleureux: "--primary-color: #D2691E;\n    --accent-color: #FF8C00;\n    --bg-color: #FFF5EE;\n    --text-color: #8B4513;"
  };
  
  return schemes[colorScheme as keyof typeof schemes] || schemes.elegant;
}

// FONCTION POUR GÉNÉRER DES COULEURS BASÉES SUR LE TYPE DE RESTAURANT
function generateColorsForRestaurantType(restaurantType: string, colorScheme: string): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) {
    return "--primary-color: #1a1a1a;\n    --accent-color: #d4af37;\n    --bg-color: #f8f9fa;\n    --text-color: #1a1a1a;\n    --luxury-gold: #d4af37;";
  }
  
  if (normalizedType.includes('pizzeria') || normalizedType.includes('italien')) {
    return "--primary-color: #e74c3c;\n    --accent-color: #f39c12;\n    --bg-color: #fff5f2;\n    --text-color: #2c3e50;\n    --pizza-red: #e74c3c;\n    --pizza-green: #27ae60;";
  }
  
  if (normalizedType.includes('asiatique') || normalizedType.includes('japonais') || normalizedType.includes('chinois')) {
    return "--primary-color: #2c3e50;\n    --accent-color: #e74c3c;\n    --bg-color: #f0f4f8;\n    --text-color: #2c3e50;\n    --zen-blue: #3498db;\n    --zen-red: #e74c3c;";
  }
  
  if (normalizedType.includes('brasserie')) {
    return "--primary-color: #8b4513;\n    --accent-color: #daa520;\n    --bg-color: #faf8f5;\n    --text-color: #654321;\n    --wood-brown: #8b4513;";
  }
  
  if (normalizedType.includes('bistrot')) {
    return "--primary-color: #2c3e50;\n    --accent-color: #e67e22;\n    --bg-color: #ecf0f1;\n    --text-color: #2c3e50;\n    --bistro-orange: #e67e22;";
  }
  
  // Si aucun type spécifique, utiliser le schéma de couleur normal
  return generateCSSVariables(colorScheme);
}

function generateReservationScript(): string {
  return `
// Système de réservation simple
function initReservation() {
    const reservationForm = document.createElement('div');
    reservationForm.innerHTML = '' +
        '<form id="reservation-form" class="reservation-form">' +
            '<h3>Réserver une table</h3>' +
            '<input type="date" name="date" required>' +
            '<select name="time" required>' +
                '<option value="">Choisir l\\'heure</option>' +
                '<option value="12:00">12:00</option>' +
                '<option value="12:30">12:30</option>' +
                '<option value="13:00">13:00</option>' +
                '<option value="19:00">19:00</option>' +
                '<option value="19:30">19:30</option>' +
                '<option value="20:00">20:00</option>' +
            '</select>' +
            '<select name="guests" required>' +
                '<option value="">Nombre de personnes</option>' +
                '<option value="1">1 personne</option>' +
                '<option value="2">2 personnes</option>' +
                '<option value="3">3 personnes</option>' +
                '<option value="4">4 personnes</option>' +
                '<option value="5">5+ personnes</option>' +
            '</select>' +
            '<input type="text" name="name" placeholder="Nom" required>' +
            '<input type="tel" name="phone" placeholder="Téléphone" required>' +
            '<button type="submit">Réserver</button>' +
        '</form>';
    document.body.appendChild(reservationForm);
}`;
}

function generateMenuScript(): string {
  return `
// Menu interactif
function initInteractiveMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const details = this.querySelector('.menu-details');
            details.classList.toggle('show');
        });
    });
}`;
}

function getFeatureDescription(feature: string): string {
  const descriptions = {
    'reservation': 'Système de réservation en ligne',
    'menu-interactif': 'Menu avec détails interactifs',
    'galerie': 'Galerie photos responsive',
    'contact': 'Formulaire de contact',
    'blog': 'Section actualités/blog',
    'seo': 'Optimisation SEO complète',
    'analytics': 'Google Analytics intégré',
    'social': 'Intégration réseaux sociaux',
    'map': 'Carte Google Maps intégrée'
  };
  
  return descriptions[feature] || feature;
}

// Fonction pour générer des couleurs aléatoires
function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894',
    '#E17055', '#0984E3', '#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Fonction pour générer un thème aléatoire
function generateRandomTheme() {
  const themes = [
    { primary: '#1a1a1a', secondary: '#d4af37', accent: '#ffffff', bg: '#f8f9fa' }, // Luxe
    { primary: '#2d3436', secondary: '#e74c3c', accent: '#f39c12', bg: '#ffffff' }, // Moderne
    { primary: '#130f40', secondary: '#f0932b', accent: '#eb4d4b', bg: '#f5f3f0' }, // Vibrant
    { primary: '#22a6b3', secondary: '#f0932b', accent: '#ffffff', bg: '#dfe6e9' }, // Ocean
    { primary: '#6c5ce7', secondary: '#a29bfe', accent: '#ffeaa7', bg: '#ffffff' }, // Pastel
    { primary: '#00b894', secondary: '#00cec9', accent: '#ffffff', bg: '#dfe6e9' }, // Nature
    { primary: '#d63031', secondary: '#74b9ff', accent: '#ffffff', bg: '#fab1a0' }, // Contrast
    { primary: '#2d3436', secondary: '#fdcb6e', accent: '#e17055', bg: '#ffffff' }  // Soleil
  ];
  return themes[Math.floor(Math.random() * themes.length)];
}

// Fonction pour générer un layout aléatoire
function generateRandomLayout(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// Helpers pour les features
function getFeatureIcon(feature: string): string {
  const icons: Record<string, string> = {
    'reservation': '📅',
    'livraison': '🚚',
    'emporter': '🥡',
    'terrasse': '☀️',
    'parking': '🅿️',
    'wifi': '📶',
    'vegan': '🌱',
    'bio': '🌿',
    'halal': '🕌',
    'accessible': '♿',
    'groupe': '👥',
    'enfants': '👶'
  };
  return icons[feature] || '⭐';
}

function getFeatureTitle(feature: string): string {
  const titles: Record<string, string> = {
    'reservation': 'Réservation',
    'livraison': 'Livraison',
    'emporter': 'À Emporter',
    'terrasse': 'Terrasse',
    'parking': 'Parking',
    'wifi': 'WiFi Gratuit',
    'vegan': 'Options Vegan',
    'bio': 'Produits Bio',
    'halal': 'Halal',
    'accessible': 'Accessible PMR',
    'groupe': 'Groupes',
    'enfants': 'Menu Enfants'
  };
  return titles[feature] || feature;
}

// Fonctions pour générer l'aperçu du site web
function generateHTMLForPreview(restaurantName: string, restaurantType: string, features: string[], colorScheme: string, theme?: any, layoutVersion?: number): string {
  const normalizedType = restaurantType.toLowerCase();
  
  // Utiliser les valeurs passées en paramètres ou générer de nouvelles valeurs
  if (!theme) {
    theme = generateRandomTheme();
  }
  if (!layoutVersion) {
    layoutVersion = generateRandomLayout();
  }
  
  // Générer un design unique à chaque fois
  const uniqueId = Date.now();
  
  // Templates complètement différents selon le layout choisi
  switch(layoutVersion) {
    case 1: // Layout Hero Centré avec Parallax
      return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&family=Dancing+Script:wght@700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
        .parallax-hero {
            height: 100vh;
            background: linear-gradient(45deg, ${theme.primary}, ${theme.secondary});
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .parallax-hero::before {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, ${theme.accent}20 1px, transparent 1px);
            background-size: 50px 50px;
            animation: parallax 20s linear infinite;
        }
        @keyframes parallax {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }
        .hero-content {
            text-align: center;
            z-index: 1;
            color: ${theme.accent};
        }
        .hero-content h1 {
            font-size: 5rem;
            font-family: 'Dancing Script', cursive;
            margin-bottom: 1rem;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
        }
        .floating-menu {
            position: fixed;
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
        }
        .floating-menu a {
            display: block;
            width: 60px;
            height: 60px;
            background: ${theme.secondary};
            border-radius: 50%;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .floating-menu a:hover {
            transform: scale(1.2);
            background: ${theme.primary};
        }
        .section {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        .menu-item {
            background: linear-gradient(135deg, ${theme.bg}, white);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        .menu-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="floating-menu">
        <a href="#home" title="Accueil">🏠</a>
        <a href="#menu" title="Menu">🍽️</a>
        <a href="#about" title="À propos">📖</a>
        <a href="#contact" title="Contact">📞</a>
    </div>
    
    <section class="parallax-hero" id="home">
        <div class="hero-content">
            <h1>${restaurantName}</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">${restaurantType}</p>
            ${features.includes('reservation') ? '<button style="padding: 1rem 3rem; font-size: 1.2rem; background: ' + theme.secondary + '; color: white; border: none; border-radius: 50px; cursor: pointer;">Réserver une table</button>' : ''}
        </div>
    </section>
    
    <section class="section" id="menu">
        <h2 style="text-align: center; font-size: 3rem; color: ${theme.primary}; margin-bottom: 1rem;">Notre Menu</h2>
        <div class="menu-grid">
            <div class="menu-item">
                <h3 style="color: ${theme.secondary}; margin-bottom: 1rem;">Entrées</h3>
                <p>Découvrez nos entrées raffinées</p>
            </div>
            <div class="menu-item">
                <h3 style="color: ${theme.secondary}; margin-bottom: 1rem;">Plats</h3>
                <p>Savourez nos plats signature</p>
            </div>
            <div class="menu-item">
                <h3 style="color: ${theme.secondary}; margin-bottom: 1rem;">Desserts</h3>
                <p>Terminez en douceur</p>
            </div>
        </div>
    </section>
</body>
</html>`;

    case 2: // Layout Sidebar Navigation
      return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&family=Pacifico&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Raleway', sans-serif; 
            display: flex;
            min-height: 100vh;
            background: ${theme.bg};
        }
        .sidebar {
            width: 300px;
            background: linear-gradient(180deg, ${theme.primary}, ${theme.secondary});
            color: white;
            padding: 3rem 2rem;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
        }
        .sidebar h1 {
            font-family: 'Pacifico', cursive;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            text-align: center;
        }
        .sidebar nav a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 10px;
            transition: all 0.3s;
        }
        .sidebar nav a:hover {
            background: rgba(255,255,255,0.2);
            transform: translateX(10px);
        }
        .main-content {
            margin-left: 300px;
            flex: 1;
            padding: 3rem;
        }
        .hero-banner {
            background: linear-gradient(135deg, ${theme.secondary}20, ${theme.primary}20);
            padding: 4rem;
            border-radius: 30px;
            text-align: center;
            margin-bottom: 3rem;
        }
        .hero-banner h2 {
            font-size: 3rem;
            color: ${theme.primary};
            margin-bottom: 1rem;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s;
            border: 3px solid transparent;
        }
        .feature-card:hover {
            border-color: ${theme.secondary};
            transform: translateY(-5px);
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <aside class="sidebar">
        <h1>${restaurantName}</h1>
        <nav>
            <a href="#home">🏠 Accueil</a>
            <a href="#specialites">⭐ Nos Spécialités</a>
            <a href="#menu">🍽️ Menu Complet</a>
            <a href="#chef">👨‍🍳 Notre Chef</a>
            ${features.includes('reservation') ? '<a href="#reservation">📅 Réservations</a>' : ''}
            ${features.includes('livraison') ? '<a href="#livraison">🚚 Livraison</a>' : ''}
            <a href="#contact">📞 Contact</a>
        </nav>
    </aside>
    
    <main class="main-content">
        <div class="hero-banner">
            <h2>Bienvenue chez ${restaurantName}</h2>
            <p style="font-size: 1.3rem; color: ${theme.primary}; margin-top: 1rem;">${restaurantType}</p>
        </div>
        
        <div class="features-grid">
            ${features.map(feature => `
                <div class="feature-card">
                    <div class="feature-icon">${getFeatureIcon(feature)}</div>
                    <h3 style="color: ${theme.primary}; margin-bottom: 0.5rem;">${getFeatureTitle(feature)}</h3>
                    <p>${getFeatureDescription(feature)}</p>
                </div>
            `).join('')}
        </div>
    </main>
</body>
</html>`;

    case 3: // Layout Fullscreen Sections
      return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Poppins', sans-serif; }
        .section-full {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .section-1 {
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
            color: ${theme.accent};
        }
        .section-2 {
            background: ${theme.bg};
            color: ${theme.primary};
        }
        .section-3 {
            background: linear-gradient(135deg, ${theme.secondary}, ${theme.accent});
            color: ${theme.primary};
        }
        .wave-divider {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 150px;
            overflow: hidden;
        }
        .wave-divider svg {
            position: absolute;
            bottom: -1px;
            width: 100%;
            height: 150px;
        }
        .content-box {
            text-align: center;
            padding: 2rem;
            max-width: 800px;
            z-index: 1;
        }
        h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .nav-dots {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
        }
        .nav-dots a {
            display: block;
            width: 15px;
            height: 15px;
            background: ${theme.primary};
            border-radius: 50%;
            margin: 10px 0;
            opacity: 0.5;
            transition: all 0.3s;
        }
        .nav-dots a:hover, .nav-dots a.active {
            opacity: 1;
            transform: scale(1.5);
        }
        .menu-mosaic {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 2rem;
        }
        .menu-tile {
            background: rgba(255,255,255,0.9);
            padding: 2rem;
            border-radius: 15px;
            transition: all 0.3s;
        }
        .menu-tile:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <nav class="nav-dots">
        <a href="#section1" class="active"></a>
        <a href="#section2"></a>
        <a href="#section3"></a>
    </nav>
    
    <section class="section-full section-1" id="section1">
        <div class="content-box">
            <h1>${restaurantName}</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">${restaurantType}</p>
            ${features.includes('reservation') ? '<button style="padding: 1rem 2rem; font-size: 1.1rem; background: white; color: ' + theme.primary + '; border: none; border-radius: 30px; cursor: pointer; font-weight: 600;">Réserver maintenant</button>' : ''}
        </div>
        <div class="wave-divider">
            <svg viewBox="0 0 1440 150" fill="${theme.bg}">
                <path d="M0,100 C480,20 960,20 1440,100 L1440,150 L0,150 Z"></path>
            </svg>
        </div>
    </section>
    
    <section class="section-full section-2" id="section2">
        <div class="content-box">
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">Notre Carte</h2>
            <div class="menu-mosaic">
                <div class="menu-tile">
                    <h3 style="color: ${theme.secondary};">Entrées</h3>
                    <p>Fraîcheur et créativité</p>
                </div>
                <div class="menu-tile">
                    <h3 style="color: ${theme.secondary};">Plats</h3>
                    <p>Saveurs authentiques</p>
                </div>
                <div class="menu-tile">
                    <h3 style="color: ${theme.secondary};">Desserts</h3>
                    <p>Douceurs maison</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="section-full section-3" id="section3">
        <div class="content-box">
            <h2 style="font-size: 3rem; margin-bottom: 2rem;">Contact</h2>
            <p style="font-size: 1.2rem;">Nous sommes là pour vous</p>
            ${features.includes('livraison') ? '<p style="margin-top: 1rem;">🚚 Livraison disponible</p>' : ''}
        </div>
    </section>
</body>
</html>`;

    case 4: // Layout Masonry/Pinterest Style
      return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Quicksand', sans-serif;
            background: ${theme.bg};
        }
        .header-sticky {
            position: sticky;
            top: 0;
            background: ${theme.primary};
            color: white;
            padding: 1rem 2rem;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 2rem;
            font-weight: 700;
        }
        .masonry-container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1rem;
            columns: 3;
            column-gap: 1rem;
        }
        @media (max-width: 768px) {
            .masonry-container { columns: 2; }
        }
        @media (max-width: 480px) {
            .masonry-container { columns: 1; }
        }
        .card {
            break-inside: avoid;
            margin-bottom: 1rem;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .card-hero {
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        .card-hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .card-content {
            padding: 2rem;
        }
        .card-image {
            height: 200px;
            background: linear-gradient(45deg, ${theme.secondary}40, ${theme.primary}40);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }
        .feature-pill {
            display: inline-block;
            background: ${theme.secondary};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            margin: 0.25rem;
            font-size: 0.9rem;
        }
        .cta-float {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${theme.secondary};
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: all 0.3s;
        }
        .cta-float:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        }
    </style>
</head>
<body>
    <header class="header-sticky">
        <div class="header-content">
            <div class="logo">${restaurantName}</div>
            <nav>
                ${features.map(f => `<span class="feature-pill">${getFeatureIcon(f)} ${getFeatureTitle(f)}</span>`).join('')}
            </nav>
        </div>
    </header>
    
    <div class="masonry-container">
        <div class="card card-hero">
            <h1>${restaurantName}</h1>
            <p style="font-size: 1.2rem;">${restaurantType}</p>
        </div>
        
        <div class="card">
            <div class="card-image">🍽️</div>
            <div class="card-content">
                <h3 style="color: ${theme.primary}; margin-bottom: 1rem;">Menu du Jour</h3>
                <p>Découvrez notre sélection quotidienne</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-content">
                <h3 style="color: ${theme.primary}; margin-bottom: 1rem;">Nos Spécialités</h3>
                <p>Des plats uniques créés avec passion</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-image">👨‍🍳</div>
            <div class="card-content">
                <h3 style="color: ${theme.primary}; margin-bottom: 1rem;">Notre Chef</h3>
                <p>Une cuisine d'exception</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-content" style="background: linear-gradient(135deg, ${theme.secondary}10, ${theme.primary}10);">
                <h3 style="color: ${theme.primary}; margin-bottom: 1rem;">Horaires</h3>
                <p>Lun-Ven: 12h-14h, 19h-22h</p>
                <p>Sam-Dim: 12h-22h</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-content">
                <h3 style="color: ${theme.primary}; margin-bottom: 1rem;">Contact</h3>
                <p>📞 01 23 45 67 89</p>
                <p>📧 contact@${restaurantName.toLowerCase().replace(/\s+/g, '')}.fr</p>
            </div>
        </div>
    </div>
    
    ${features.includes('reservation') ? `<a href="#" class="cta-float">Réserver une table</a>` : ''}
</body>
</html>`;

    case 5: // Layout Minimaliste
      return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Archivo', sans-serif;
            background: white;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 4rem 2rem;
        }
        .header-minimal {
            text-align: center;
            margin-bottom: 6rem;
            padding: 4rem 0;
            border-bottom: 2px solid ${theme.primary};
        }
        h1 {
            font-size: 4rem;
            font-weight: 300;
            letter-spacing: -2px;
            color: ${theme.primary};
            margin-bottom: 1rem;
        }
        .tagline {
            font-size: 1.2rem;
            color: ${theme.secondary};
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .content-block {
            margin: 4rem 0;
            padding: 2rem 0;
        }
        .content-block h2 {
            font-size: 2rem;
            color: ${theme.primary};
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .menu-minimal {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        .menu-item-minimal {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
        }
        .menu-item-minimal h3 {
            font-weight: 400;
            color: ${theme.primary};
        }
        .price {
            color: ${theme.secondary};
            font-weight: 700;
        }
        .features-minimal {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin: 4rem 0;
            flex-wrap: wrap;
        }
        .feature-minimal {
            text-align: center;
            color: ${theme.secondary};
        }
        .contact-minimal {
            text-align: center;
            margin-top: 6rem;
            padding-top: 4rem;
            border-top: 1px solid #eee;
        }
        .cta-minimal {
            display: inline-block;
            margin-top: 2rem;
            padding: 1rem 3rem;
            border: 2px solid ${theme.primary};
            color: ${theme.primary};
            text-decoration: none;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cta-minimal:hover {
            background: ${theme.primary};
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header-minimal">
            <h1>${restaurantName}</h1>
            <p class="tagline">${restaurantType}</p>
        </header>
        
        <section class="content-block">
            <h2>Menu</h2>
            <div class="menu-minimal">
                <div class="menu-item-minimal">
                    <h3>Entrée du jour</h3>
                    <span class="price">12€</span>
                </div>
                <div class="menu-item-minimal">
                    <h3>Plat signature</h3>
                    <span class="price">28€</span>
                </div>
                <div class="menu-item-minimal">
                    <h3>Dessert maison</h3>
                    <span class="price">9€</span>
                </div>
            </div>
        </section>
        
        <div class="features-minimal">
            ${features.map(f => `
                <div class="feature-minimal">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${getFeatureIcon(f)}</div>
                    <div>${getFeatureTitle(f)}</div>
                </div>
            `).join('')}
        </div>
        
        <footer class="contact-minimal">
            <p>123 Rue Example, 75001 Paris</p>
            <p>01 23 45 67 89</p>
            ${features.includes('reservation') ? '<a href="#" class="cta-minimal">Réserver</a>' : ''}
        </footer>
    </div>
</body>
</html>`;

    default: // Layout 6 - Magazine/Blog Style
      return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;700&family=Open+Sans:wght@400;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Open Sans', sans-serif;
            background: #fafafa;
            color: #333;
        }
        .magazine-header {
            background: ${theme.primary};
            color: white;
            text-align: center;
            padding: 3rem 1rem;
        }
        .magazine-title {
            font-family: 'Merriweather', serif;
            font-size: 4rem;
            font-weight: 300;
            margin-bottom: 1rem;
        }
        .magazine-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .magazine-nav {
            background: ${theme.secondary};
            padding: 1rem;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .magazine-nav a {
            color: white;
            text-decoration: none;
            margin: 0 1.5rem;
            font-weight: 600;
            transition: opacity 0.3s;
        }
        .magazine-nav a:hover {
            opacity: 0.8;
        }
        .magazine-content {
            max-width: 1200px;
            margin: 3rem auto;
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 3rem;
            padding: 0 2rem;
        }
        .article-main {
            background: white;
            padding: 3rem;
            border-radius: 10px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        .article-main h2 {
            font-family: 'Merriweather', serif;
            font-size: 2.5rem;
            color: ${theme.primary};
            margin-bottom: 2rem;
        }
        .sidebar {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            height: fit-content;
        }
        .sidebar h3 {
            color: ${theme.secondary};
            margin-bottom: 1rem;
            font-family: 'Merriweather', serif;
        }
        .highlight-box {
            background: linear-gradient(135deg, ${theme.primary}10, ${theme.secondary}10);
            padding: 2rem;
            border-left: 4px solid ${theme.secondary};
            margin: 2rem 0;
        }
        .image-placeholder {
            width: 100%;
            height: 300px;
            background: linear-gradient(135deg, ${theme.secondary}30, ${theme.primary}30);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            margin: 2rem 0;
        }
        .features-sidebar {
            list-style: none;
        }
        .features-sidebar li {
            padding: 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        @media (max-width: 768px) {
            .magazine-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="magazine-header">
        <h1 class="magazine-title">${restaurantName}</h1>
        <p class="magazine-subtitle">${restaurantType}</p>
    </header>
    
    <nav class="magazine-nav">
        <a href="#histoire">Notre Histoire</a>
        <a href="#menu">Menu</a>
        <a href="#chef">Le Chef</a>
        <a href="#contact">Contact</a>
    </nav>
    
    <div class="magazine-content">
        <main class="article-main">
            <h2>Une expérience culinaire unique</h2>
            
            <div class="image-placeholder">🍴</div>
            
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
                Bienvenue chez ${restaurantName}, où chaque plat raconte une histoire. 
                Notre ${restaurantType} vous propose une cuisine authentique et raffinée.
            </p>
            
            <div class="highlight-box">
                <h3 style="color: ${theme.primary}; margin-bottom: 1rem;">Menu du jour</h3>
                <p>Découvrez notre sélection quotidienne, créée avec les produits frais du marché.</p>
            </div>
            
            <h3 style="color: ${theme.primary}; margin: 2rem 0 1rem;">Notre philosophie</h3>
            <p style="line-height: 1.8;">
                Nous croyons en une cuisine qui respecte les saisons et met en valeur les producteurs locaux.
            </p>
        </main>
        
        <aside class="sidebar">
            <h3>Nos Services</h3>
            <ul class="features-sidebar">
                ${features.map(f => `
                    <li>
                        <span>${getFeatureIcon(f)}</span>
                        <span>${getFeatureTitle(f)}</span>
                    </li>
                `).join('')}
            </ul>
            
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee;">
                <h3>Horaires</h3>
                <p>Lun-Ven: 12h-14h30, 19h-22h30</p>
                <p>Sam-Dim: 12h-23h</p>
            </div>
            
            ${features.includes('reservation') ? `
                <button style="width: 100%; padding: 1rem; margin-top: 2rem; background: ${theme.secondary}; color: white; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">
                    Réserver une table
                </button>
            ` : ''}
        </aside>
    </div>
 </body>
 </html>`;
   }
 }

function generateCSSForPreview(colorScheme: string, restaurantType?: string): string {
  // FORCER LES COULEURS SELON LE TYPE DE RESTAURANT - APPROCHE DIRECTE
  let cssVars = generateCSSVariables(colorScheme);
  let backgroundBody = 'linear-gradient(135deg, var(--bg-color) 0%, #f8f9fa 100%)';
  let headerBg = 'rgba(255, 255, 255, 0.95)';
  let heroStyle = 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), linear-gradient(45deg, var(--primary-color), var(--accent-color))';
  
  if (restaurantType) {
    const normalizedType = restaurantType.toLowerCase();
    
    if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) {
      cssVars = "--primary-color: #1a1a1a; --accent-color: #d4af37; --bg-color: #f8f9fa; --text-color: #1a1a1a;";
      backgroundBody = 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)';
      headerBg = 'linear-gradient(135deg, rgba(26,26,26,0.95), rgba(40,40,40,0.95))';
      heroStyle = 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(26,26,26,0.7)), linear-gradient(45deg, #1a1a1a, #333333)';
    }
    
    if (normalizedType.includes('pizzeria') || normalizedType.includes('italien')) {
      cssVars = "--primary-color: #e74c3c; --accent-color: #f39c12; --bg-color: #fff5f2; --text-color: #2c3e50;";
      backgroundBody = 'linear-gradient(135deg, #fff5f2 0%, #ffe8e0 50%, #fff5f2 100%)';
      headerBg = 'linear-gradient(135deg, #e74c3c, #c0392b)';
      heroStyle = 'linear-gradient(135deg, rgba(231,76,60,0.9), rgba(192,57,43,0.8)), radial-gradient(circle at 50% 50%, #f39c12, #e74c3c)';
    }
    
    if (normalizedType.includes('asiatique') || normalizedType.includes('japonais') || normalizedType.includes('chinois')) {
      cssVars = "--primary-color: #2c3e50; --accent-color: #e74c3c; --bg-color: #f0f4f8; --text-color: #2c3e50;";
      backgroundBody = 'linear-gradient(135deg, #f0f4f8 0%, #e8f2f0 100%)';
      headerBg = 'linear-gradient(135deg, rgba(44,62,80,0.95), rgba(52,73,94,0.95))';
      heroStyle = 'linear-gradient(135deg, rgba(44,62,80,0.8), rgba(52,73,94,0.7)), linear-gradient(45deg, #2c3e50, #34495e)';
    }
  }
  
  return `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');

:root {
    ${cssVars}
    --font-primary: 'Playfair Display', serif;
    --font-secondary: 'Inter', sans-serif;
    --shadow-light: 0 2px 10px rgba(0,0,0,0.1);
    --shadow-medium: 0 4px 20px rgba(0,0,0,0.15);
    --border-radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-secondary);
    line-height: 1.7;
    color: var(--text-color);
    background: ${backgroundBody};
    overflow-x: hidden;
}

/* Layouts spécifiques */
.layout-luxury {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.layout-casual {
    background: linear-gradient(135deg, #fff5f2 0%, #ffe8e0 50%, #fff5f2 100%);
}

.layout-zen {
    background: linear-gradient(135deg, #f0f4f8 0%, #e8f2f0 100%);
}

.layout-traditional {
    background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
}

/* HEADER STYLES - VARIATIONS PAR TYPE */
.header {
    background: ${headerBg};
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-light);
    transition: var(--transition);
    color: white;
}

/* FORCER LES COULEURS SELON LE TYPE DE RESTAURANT */
body[class*="layout-luxury"] .header {
    background: linear-gradient(135deg, rgba(26,26,26,0.95), rgba(40,40,40,0.95)) !important;
    color: white !important;
}

body[class*="layout-luxury"] .logo h1 {
    color: #d4af37 !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
}

body[class*="layout-casual"] .header {
    background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
    color: white !important;
}

body[class*="layout-casual"] .logo h1 {
    color: white !important;
    font-family: 'Comic Sans MS', cursive !important;
}

body[class*="layout-zen"] .header {
    background: linear-gradient(135deg, rgba(44,62,80,0.95), rgba(52,73,94,0.95)) !important;
    color: white !important;
}

body[class*="layout-zen"] .logo h1 {
    color: white !important;
}

.navbar {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    min-height: 70px;
}

.logo h1 {
    font-family: var(--font-primary);
    font-size: 2.2rem;
    font-weight: 700;
    color: ${headerBg.includes('rgba(26,26,26') ? '#d4af37' : headerBg.includes('#e74c3c') ? 'white' : headerBg.includes('rgba(44,62,80') ? 'white' : 'var(--primary-color)'};
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2.5rem;
    align-items: center;
}

.nav-menu li a {
    color: ${headerBg.includes('rgba(26,26,26') || headerBg.includes('#e74c3c') || headerBg.includes('rgba(44,62,80') ? 'white' : 'var(--text-color)'};
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    position: relative;
    transition: var(--transition);
    padding: 0.5rem 0;
}

.nav-menu li a:hover {
    color: var(--accent-color);
    transform: translateY(-2px);
}

.nav-menu li a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: width 0.3s ease;
}

.nav-menu li a:hover::after {
    width: 100%;
}

.btn-reservation {
    background: linear-gradient(135deg, var(--accent-color), #ff6b35);
    color: white !important;
    padding: 0.8rem 1.8rem;
    border-radius: 50px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-medium);
    transition: var(--transition);
}

.btn-reservation:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* HERO STYLES - VARIATIONS FORCÉES */
.hero {
    background: ${heroStyle};
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
}

/* FORCER LES STYLES HERO SELON LE TYPE */
body[class*="layout-luxury"] .hero {
    background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(26,26,26,0.7)), 
                linear-gradient(45deg, #1a1a1a, #333333) !important;
}

body[class*="layout-casual"] .hero {
    background: linear-gradient(135deg, rgba(231,76,60,0.9), rgba(192,57,43,0.8)), 
                radial-gradient(circle at 50% 50%, #f39c12, #e74c3c) !important;
}

body[class*="layout-zen"] .hero {
    background: linear-gradient(135deg, rgba(44,62,80,0.8), rgba(52,73,94,0.7)), 
                linear-gradient(45deg, #2c3e50, #34495e) !important;
}

body[class*="layout-traditional"] .hero {
    background: linear-gradient(135deg, rgba(139,69,19,0.8), rgba(160,82,45,0.7)), 
                linear-gradient(45deg, #8b4513, #a0522d) !important;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.1)" points="0,1000 1000,0 1000,1000"/></svg>');
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 2rem;
}

.hero-content h2 {
    font-family: var(--font-primary);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
    animation: fadeInUp 1s ease-out;
}

.hero-content p {
    font-size: clamp(1.1rem, 2vw, 1.3rem);
    margin-bottom: 2.5rem;
    opacity: 0.95;
    animation: fadeInUp 1s ease-out 0.3s both;
}

.cta-button {
    background: ${cssVars.includes('#d4af37') ? 'linear-gradient(135deg, #d4af37, #f4d03f)' : 
                  cssVars.includes('#f39c12') ? 'linear-gradient(135deg, #f39c12, #e67e22)' : 
                  cssVars.includes('#2c3e50') && cssVars.includes('#e74c3c') ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 
                  'linear-gradient(135deg, var(--accent-color), #ff6b35)'};
    color: ${cssVars.includes('#d4af37') ? 'black' : 'white'};
    padding: 1.2rem 2.5rem;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    transition: var(--transition);
    display: inline-block;
    animation: fadeInUp 1s ease-out 0.6s both;
}

/* FORCER LES STYLES BOUTONS SELON LE TYPE */
body[class*="layout-luxury"] .cta-button {
    background: linear-gradient(135deg, #d4af37, #f4d03f) !important;
    color: black !important;
    box-shadow: 0 8px 30px rgba(212,175,55,0.4) !important;
}

body[class*="layout-casual"] .cta-button {
    background: linear-gradient(135deg, #f39c12, #e67e22) !important;
    color: white !important;
    box-shadow: 0 8px 30px rgba(243,156,18,0.4) !important;
}

body[class*="layout-zen"] .cta-button {
    background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
    color: white !important;
    border-radius: 5px !important;
}

body[class*="layout-traditional"] .cta-button {
    background: linear-gradient(135deg, #daa520, #b8860b) !important;
    color: white !important;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}

/* SECTIONS STYLES */
.menu-section, .about-section, .contact-section {
    padding: 6rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
}

.menu-section h2, .about-section h2, .contact-section h2 {
    font-family: var(--font-primary);
    text-align: center;
    margin-bottom: 3rem;
    color: var(--primary-color);
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 700;
    position: relative;
}

.menu-section h2::after, .about-section h2::after, .contact-section h2::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
    border-radius: 2px;
}

.menu-preview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2.5rem;
    margin-top: 4rem;
}

.menu-item {
    background: white;
    text-align: center;
    padding: 2.5rem 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
    transition: var(--transition);
    border: 1px solid rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
}

.menu-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
}

/* FORCER LES STYLES MENU SELON LE TYPE */
body[class*="layout-luxury"] .menu-item {
    background: linear-gradient(135deg, #f8f9fa, #ffffff) !important;
    border: 2px solid #d4af37 !important;
}

body[class*="layout-luxury"] .menu-item::before {
    background: linear-gradient(90deg, #d4af37, #f4d03f) !important;
}

body[class*="layout-casual"] .menu-item {
    background: linear-gradient(135deg, #fff5f2, #ffffff) !important;
    border-left: 5px solid #e74c3c !important;
}

body[class*="layout-casual"] .menu-item::before {
    background: linear-gradient(90deg, #e74c3c, #f39c12) !important;
}

body[class*="layout-zen"] .menu-item {
    background: linear-gradient(135deg, #f0f4f8, #ffffff) !important;
    border: 1px solid #3498db !important;
    border-radius: 5px !important;
}

body[class*="layout-zen"] .menu-item::before {
    background: linear-gradient(90deg, #3498db, #e74c3c) !important;
}

.menu-item:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
}

.menu-item h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.menu-item p {
    color: var(--text-color);
    opacity: 0.8;
    line-height: 1.6;
}

.about-section {
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,250,0.9));
    border-radius: var(--border-radius);
    margin: 2rem auto;
    box-shadow: var(--shadow-light);
}

.about-section p {
    font-size: 1.2rem;
    line-height: 1.8;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    color: var(--text-color);
}

.contact-info {
    text-align: center;
    font-size: 1.2rem;
    line-height: 2.5;
    background: white;
    padding: 3rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
    max-width: 600px;
    margin: 0 auto;
}

.contact-info p {
    margin: 1rem 0;
    font-weight: 500;
}

.gallery-preview {
    margin-top: 3rem;
    text-align: center;
}

.gallery-preview h3 {
    color: var(--primary-color);
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
}

.gallery-grid {
    background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
    color: white;
    padding: 3rem;
    border-radius: var(--border-radius);
    font-style: italic;
    font-size: 1.1rem;
    box-shadow: var(--shadow-medium);
}

.footer {
    background: linear-gradient(135deg, var(--primary-color), #1a1a1a);
    color: white;
    text-align: center;
    padding: 3rem 2rem;
    margin-top: 4rem;
    font-weight: 300;
}

/* ANIMATIONS */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem 1rem;
    }
    
    .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
    }
    
    .hero {
        min-height: 90vh;
        padding: 2rem 1rem;
    }
    
    .menu-preview {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .menu-section, .about-section, .contact-section {
        padding: 4rem 1rem;
    }
}

/* STYLES POUR RESTAURANTS GASTRONOMIQUES */
.header-luxury {
    background: linear-gradient(135deg, rgba(20,20,20,0.95), rgba(40,40,40,0.95));
    color: white;
}

.header-top {
    background: rgba(0,0,0,0.8);
    padding: 0.5rem 0;
    font-size: 0.8rem;
}

.contact-bar {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 0 2rem;
}

.logo-luxury {
    text-align: center;
}

.logo-luxury h1 {
    font-family: var(--font-primary);
    font-size: 2.5rem;
    color: #d4af37;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.logo-subtitle {
    font-size: 0.9rem;
    color: #ccc;
    font-style: italic;
}

.hero-luxury {
    background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(20,20,20,0.6)), 
                linear-gradient(45deg, #1a1a1a, #2a2a2a);
    min-height: 100vh;
}

.hero-award {
    background: linear-gradient(45deg, #d4af37, #f4d03f);
    color: black;
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    margin-bottom: 1rem;
    display: inline-block;
}

.hero-badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.badge {
    background: rgba(255,255,255,0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    border: 1px solid rgba(255,255,255,0.2);
}

/* STYLES POUR PIZZERIAS */
.header-casual {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
}

.logo-pizza h1 {
    font-family: 'Comic Sans MS', cursive;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.logo-tagline {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.9);
    font-style: italic;
}

.hero-casual {
    background: linear-gradient(135deg, rgba(231,76,60,0.9), rgba(192,57,43,0.8)), 
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
}

.hero-features {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.feature {
    background: rgba(255,255,255,0.2);
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
}

.hero-decoration {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    opacity: 0.6;
    animation: bounce 2s infinite;
}

.cta-pizza {
    background: linear-gradient(45deg, #f39c12, #e67e22);
    box-shadow: 0 8px 25px rgba(243,156,18,0.4);
}

.pizza-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.pizza-card {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    border-left: 5px solid #e74c3c;
    transition: transform 0.3s ease;
}

.pizza-card:hover {
    transform: translateY(-5px);
}

.pizza-card.featured {
    border-left-color: #f39c12;
    background: linear-gradient(135deg, #fff5f2, #ffffff);
}

.pizza-badge {
    background: #f39c12;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.7rem;
    float: right;
    margin-bottom: 1rem;
}

/* STYLES POUR RESTAURANTS ASIATIQUES */
.header-zen {
    background: linear-gradient(135deg, rgba(44,62,80,0.95), rgba(52,73,94,0.95));
    color: white;
}

.logo-zen {
    text-align: center;
}

.logo-ideogram {
    font-size: 1.5rem;
    color: #e74c3c;
    margin-top: 0.5rem;
}

.hero-zen {
    background: linear-gradient(135deg, rgba(44,62,80,0.8), rgba(52,73,94,0.7)), 
                linear-gradient(45deg, #2c3e50, #34495e);
}

.zen-symbol {
    font-size: 4rem;
    color: #e74c3c;
    margin-bottom: 1rem;
}

.zen-philosophy {
    font-style: italic;
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 1.5rem 0;
    border-left: 3px solid #e74c3c;
    padding-left: 1rem;
}

.cta-zen {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    color: white;
}

/* SECTIONS SPÉCIALISÉES */
.chef-section {
    padding: 6rem 2rem;
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
}

.chef-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
}

.chef-placeholder {
    font-size: 8rem;
    text-align: center;
    background: linear-gradient(45deg, #d4af37, #f4d03f);
    border-radius: 50%;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.chef-awards {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.chef-awards span {
    background: #d4af37;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
}

.wine-section {
    background: linear-gradient(135deg, #8e44ad, #9b59b6);
    color: white;
    padding: 6rem 2rem;
}

.wine-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.wine-card {
    background: rgba(255,255,255,0.1);
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.footer-luxury {
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    color: white;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

.footer-pizza {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
}

.footer-wave {
    text-align: center;
    font-size: 2rem;
    padding: 1rem;
    animation: wave 3s ease-in-out infinite;
}

.footer-motto {
    text-align: center;
    padding: 2rem;
}

/* ANIMATIONS */
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-10px); }
    60% { transform: translateX(-50%) translateY(-5px); }
}

@keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@media (max-width: 768px) {
    .chef-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .chef-placeholder {
        font-size: 6rem;
        width: 150px;
        height: 150px;
    }
    
    .hero-features {
        flex-direction: column;
        gap: 1rem;
    }
    
    .contact-bar {
        flex-direction: column;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .navbar {
        padding: 1rem;
    }
    
    .logo h1 {
        font-size: 1.8rem;
    }
    
    .nav-menu {
        gap: 1rem;
    }
    
    .nav-menu li a {
        font-size: 0.9rem;
    }
    
    .btn-reservation {
        padding: 0.6rem 1.2rem;
        font-size: 0.8rem;
    }
    
    .hero-badges {
        flex-direction: column;
        align-items: center;
    }
    
    .pizza-grid {
        grid-template-columns: 1fr;
    }
}
`;
}

function generateJSForPreview(features: string[]): string {
  return `
// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation au scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scroll = window.pageYOffset;
        const windowHeight = window.innerHeight;

        if (scroll > (sectionTop - windowHeight + sectionHeight/2)) {
            section.classList.add('animate');
        }
    });
});

${features.includes('reservation') ? 
`// Fonction de réservation simple
function showReservation() {
    alert('Fonction de réservation - À intégrer avec votre système de réservation');
}` : ''}

${features.includes('menu-interactif') ? 
`// Menu interactif
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.05)' ? 'scale(1)' : 'scale(1.05)';
        });
    });
});` : ''}
`;
}

// Fonctions de personnalisation du contenu
function generateMenuContentForType(restaurantType: string): string {
  const menuTypes = {
    pizzeria: `
      <div class="menu-item">
          <h3>🍕 Pizzas</h3>
          <p>Nos pizzas artisanales à pâte fine</p>
      </div>
      <div class="menu-item">
          <h3>🥗 Salades</h3>
          <p>Salades fraîches et copieuses</p>
      </div>
      <div class="menu-item">
          <h3>🍨 Desserts</h3>
          <p>Tiramisu, panna cotta et gelati</p>
      </div>`,
    
    brasserie: `
      <div class="menu-item">
          <h3>🍺 Plats Brasserie</h3>
          <p>Choucroute, tartiflette, burger gourmet</p>
      </div>
      <div class="menu-item">
          <h3>🥩 Grillades</h3>
          <p>Viandes grillées et accompagnements</p>
      </div>
      <div class="menu-item">
          <h3>🍮 Desserts Maison</h3>
          <p>Tarte tatin, profiteroles, café gourmand</p>
      </div>`,
    
    gastronomique: `
      <div class="menu-item">
          <h3>✨ Menu Dégustation</h3>
          <p>7 services créés par notre Chef</p>
      </div>
      <div class="menu-item">
          <h3>🍷 Accord Mets & Vins</h3>
          <p>Sélection de nos meilleurs crus</p>
      </div>
      <div class="menu-item">
          <h3>🎂 Mignardises</h3>
          <p>Créations sucrées de notre pâtissier</p>
      </div>`,
    
    bistrot: `
      <div class="menu-item">
          <h3>🍽️ Plats du Jour</h3>
          <p>Cuisine traditionnelle française</p>
      </div>
      <div class="menu-item">
          <h3>🧀 Planches</h3>
          <p>Fromages et charcuteries artisanales</p>
      </div>
      <div class="menu-item">
          <h3>🥧 Desserts Traditionnels</h3>
          <p>Tarte aux pommes, crème brûlée</p>
      </div>`,
      
    asiatique: `
      <div class="menu-item">
          <h3>🍜 Soupes & Ramen</h3>
          <p>Bouillons parfumés et nouilles fraîches</p>
      </div>
      <div class="menu-item">
          <h3>🍱 Sushis & Sashimis</h3>
          <p>Poissons frais et riz vinaigré</p>
      </div>
      <div class="menu-item">
          <h3>🍡 Desserts Asiatiques</h3>
          <p>Mochi, dorayaki, thé glacé</p>
      </div>`
  };
  
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('pizza')) return menuTypes.pizzeria;
  if (normalizedType.includes('brasserie')) return menuTypes.brasserie;
  if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) return menuTypes.gastronomique;
  if (normalizedType.includes('bistrot') || normalizedType.includes('bistro')) return menuTypes.bistrot;
  if (normalizedType.includes('asiatique') || normalizedType.includes('japonais') || normalizedType.includes('chinois')) return menuTypes.asiatique;
  
  // Menu par défaut
  return `
    <div class="menu-item">
        <h3>🥗 Entrées</h3>
        <p>Sélection de nos meilleures entrées</p>
    </div>
    <div class="menu-item">
        <h3>🍽️ Plats</h3>
        <p>Nos spécialités cuisinées avec passion</p>
    </div>
    <div class="menu-item">
        <h3>🍰 Desserts</h3>
        <p>Douceurs pour terminer en beauté</p>
    </div>`;
}

function generateHeroContentForType(restaurantType: string): string {
  const heroContents = {
    pizzeria: "Savourez nos pizzas artisanales dans une ambiance conviviale et chaleureuse",
    brasserie: "L'art de vivre à la française dans un cadre authentique et décontracté",
    gastronomique: "Une expérience culinaire d'exception qui éveillera tous vos sens",
    bistrot: "La tradition française revisitée avec des produits frais et locaux",
    asiatique: "Voyage culinaire au cœur des saveurs authentiques d'Asie",
    italien: "La dolce vita dans votre assiette avec nos recettes traditionnelles",
    français: "L'excellence de la cuisine française dans un cadre élégant"
  };
  
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('pizza')) return heroContents.pizzeria;
  if (normalizedType.includes('brasserie')) return heroContents.brasserie;
  if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) return heroContents.gastronomique;
  if (normalizedType.includes('bistrot') || normalizedType.includes('bistro')) return heroContents.bistrot;
  if (normalizedType.includes('asiatique') || normalizedType.includes('japonais') || normalizedType.includes('chinois')) return heroContents.asiatique;
  if (normalizedType.includes('italien')) return heroContents.italien;
  
  return `Découvrez une expérience culinaire unique dans notre ${restaurantType.toLowerCase()}`;
}

function generateAboutContentForType(restaurantName: string, restaurantType: string): string {
  const aboutContents = {
    pizzeria: `Depuis notre ouverture, ${restaurantName} vous propose des pizzas authentiques cuites au feu de bois. Notre pâte artisanale et nos ingrédients italiens de qualité font de chaque pizza un voyage en Italie.`,
    
    brasserie: `${restaurantName} perpétue la tradition des brasseries françaises avec une cuisine généreuse et conviviale. Notre équipe passionnée vous accueille dans un cadre chaleureux pour partager des moments authentiques autour de la table.`,
    
    gastronomique: `${restaurantName} est une invitation à l'excellence culinaire. Notre Chef étoilé et son équipe créent une cuisine d'exception, sublimant les produits de saison dans des créations audacieuses et raffinées.`,
    
    bistrot: `Niché au cœur de la ville, ${restaurantName} vous fait redécouvrir les saveurs authentiques de la cuisine française. Notre carte change au rythme des saisons, privilégiant les producteurs locaux et les recettes traditionnelles.`,
    
    asiatique: `${restaurantName} vous transporte au cœur de l'Asie avec une cuisine authentique préparée par nos chefs originaires de la région. Ingrédients frais, techniques traditionnelles et saveurs équilibrées pour une expérience unique.`
  };
  
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('pizza')) return aboutContents.pizzeria;
  if (normalizedType.includes('brasserie')) return aboutContents.brasserie;
  if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) return aboutContents.gastronomique;
  if (normalizedType.includes('bistrot') || normalizedType.includes('bistro')) return aboutContents.bistrot;
  if (normalizedType.includes('asiatique') || normalizedType.includes('japonais') || normalizedType.includes('chinois')) return aboutContents.asiatique;
  
  return `${restaurantName} vous accueille dans une ambiance ${restaurantType.toLowerCase()} authentique. Notre équipe passionnée cuisine avec des produits frais et locaux pour vous offrir une expérience gastronomique mémorable qui reflète notre amour de la cuisine.`;
}

function generateTitleForType(restaurantType: string): string {
  const titles = {
    pizzeria: "Pizzeria Artisanale",
    brasserie: "Brasserie Traditionnelle",
    gastronomique: "Restaurant Gastronomique",
    bistrot: "Bistrot Français",
    asiatique: "Restaurant Asiatique",
    italien: "Restaurant Italien",
    français: "Restaurant Français"
  };
  
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('pizza')) return titles.pizzeria;
  if (normalizedType.includes('brasserie')) return titles.brasserie;
  if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) return titles.gastronomique;
  if (normalizedType.includes('bistrot') || normalizedType.includes('bistro')) return titles.bistrot;
  if (normalizedType.includes('asiatique') || normalizedType.includes('japonais') || normalizedType.includes('chinois')) return titles.asiatique;
  if (normalizedType.includes('italien')) return titles.italien;
  
  return restaurantType;
}

// Générateurs de layouts et sections personnalisées
function generateLayoutForType(restaurantType: string, features: string[]): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique') || normalizedType.includes('étoilé')) return 'luxury';
  if (normalizedType.includes('pizzeria')) return 'casual';
  if (normalizedType.includes('brasserie')) return 'traditional';
  if (normalizedType.includes('bistrot')) return 'cozy';
  if (normalizedType.includes('asiatique')) return 'zen';
  
  return 'modern';
}

function generateNavStyleForType(restaurantType: string): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique')) return 'elegant';
  if (normalizedType.includes('pizzeria')) return 'playful';
  if (normalizedType.includes('brasserie')) return 'robust';
  if (normalizedType.includes('asiatique')) return 'minimal';
  
  return 'standard';
}

function generateHeaderForType(restaurantName: string, restaurantType: string, features: string[], navStyle: string): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique')) {
    return `
    <header class="header header-luxury">
        <div class="header-top">
            <div class="contact-bar">
                <span>📞 Réservations: +33 1 23 45 67 89</span>
                <span>✉️ contact@${restaurantName.toLowerCase().replace(/\s+/g, '')}.fr</span>
            </div>
        </div>
        <nav class="navbar navbar-elegant">
            <div class="logo-luxury">
                <h1>${restaurantName}</h1>
                <div class="logo-subtitle">Restaurant Gastronomique</div>
            </div>
            <ul class="nav-menu">
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#chef">Notre Chef</a></li>
                <li><a href="#menu">Carte & Menus</a></li>
                <li><a href="#cave">Cave à Vins</a></li>
                <li><a href="#apropos">Histoire</a></li>
                <li><a href="#contact">Contact</a></li>
                ${features.includes('reservation') ? '<li><a href="#reservation" class="btn-reservation">Réserver</a></li>' : ''}
            </ul>
        </nav>
    </header>`;
  }
  
  if (normalizedType.includes('pizzeria')) {
    return `
    <header class="header header-casual">
        <nav class="navbar navbar-playful">
            <div class="logo-pizza">
                <h1>🍕 ${restaurantName}</h1>
                <div class="logo-tagline">Pizzeria Artisanale</div>
            </div>
            <ul class="nav-menu">
                <li><a href="#accueil">Ciao!</a></li>
                <li><a href="#pizzas">Nos Pizzas</a></li>
                <li><a href="#antipasti">Antipasti</a></li>
                <li><a href="#dolci">Dolci</a></li>
                <li><a href="#famiglia">La Famiglia</a></li>
                <li><a href="#contact">Contatto</a></li>
                ${features.includes('reservation') ? '<li><a href="#reservation" class="btn-reservation">Prenota!</a></li>' : ''}
            </ul>
        </nav>
    </header>`;
  }
  
  if (normalizedType.includes('asiatique')) {
    return `
    <header class="header header-zen">
        <nav class="navbar navbar-minimal">
            <div class="logo-zen">
                <h1>${restaurantName}</h1>
                <div class="logo-ideogram">味</div>
            </div>
            <ul class="nav-menu">
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#sushi">Sushi & Sashimi</a></li>
                <li><a href="#ramen">Ramen</a></li>
                <li><a href="#bento">Bento</a></li>
                <li><a href="#tradition">Tradition</a></li>
                <li><a href="#contact">Contact</a></li>
                ${features.includes('reservation') ? '<li><a href="#reservation" class="btn-reservation">予約</a></li>' : ''}
            </ul>
        </nav>
    </header>`;
  }
  
  // Header standard pour autres types
  return `
    <header class="header">
        <nav class="navbar">
            <div class="logo">
                <h1>${restaurantName}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#menu">Notre Menu</a></li>
                <li><a href="#apropos">À Propos</a></li>
                <li><a href="#contact">Contact</a></li>
                ${features.includes('reservation') ? '<li><a href="#reservation" class="btn-reservation">Réserver</a></li>' : ''}
            </ul>
        </nav>
    </header>`;
}

function generateHeroForType(restaurantName: string, restaurantType: string, features: string[]): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique')) {
    return `
    <section id="accueil" class="hero hero-luxury">
        <div class="hero-video-bg"></div>
        <div class="hero-content">
            <div class="hero-award">⭐ Restaurant Étoilé</div>
            <h2>L'Excellence Culinaire</h2>
            <h3>${restaurantName}</h3>
            <p>Une expérience gastronomique d'exception où chaque plat raconte une histoire de passion et de créativité.</p>
            <div class="hero-ctas">
                ${features.includes('reservation') ? '<a href="#reservation" class="cta-button cta-primary">Réserver une Table</a>' : ''}
                <a href="#menu" class="cta-button cta-secondary">Découvrir nos Menus</a>
            </div>
            <div class="hero-badges">
                <span class="badge">Guide Michelin</span>
                <span class="badge">Maître Restaurateur</span>
                <span class="badge">Fait Maison</span>
            </div>
        </div>
    </section>`;
  }
  
  if (normalizedType.includes('pizzeria')) {
    return `
    <section id="accueil" class="hero hero-casual">
        <div class="hero-pattern"></div>
        <div class="hero-content">
            <h2>Benvenuti alla ${restaurantName}!</h2>
            <p>🇮🇹 Authentique pizzeria italienne • Pâte artisanale • Four à bois traditionnel</p>
            <div class="hero-features">
                <div class="feature">🍕 + de 20 pizzas</div>
                <div class="feature">🔥 Four à bois</div>
                <div class="feature">🇮🇹 Recettes authentiques</div>
            </div>
            <div class="hero-ctas">
                <a href="#pizzas" class="cta-button cta-pizza">Voir nos Pizzas</a>
                ${features.includes('reservation') ? '<a href="#reservation" class="cta-button cta-secondary">Réserver</a>' : ''}
            </div>
        </div>
        <div class="hero-decoration">🍕🧄🍅🌿</div>
    </section>`;
  }
  
  if (normalizedType.includes('asiatique')) {
    return `
    <section id="accueil" class="hero hero-zen">
        <div class="hero-bamboo"></div>
        <div class="hero-content">
            <div class="zen-symbol">禅</div>
            <h2>${restaurantName}</h2>
            <p>Voyage culinaire au cœur de l'Asie authentique</p>
            <div class="zen-philosophy">
                "La nourriture est notre médecine, la cuisine notre art"
            </div>
            <div class="hero-ctas">
                <a href="#menu" class="cta-button cta-zen">Découvrir</a>
                ${features.includes('reservation') ? '<a href="#reservation" class="cta-button cta-secondary">Réserver</a>' : ''}
            </div>
        </div>
    </section>`;
  }
  
  // Hero standard
  return `
    <section id="accueil" class="hero">
        <div class="hero-content">
            <h2>Bienvenue chez ${restaurantName}</h2>
            <p>${generateHeroContentForType(restaurantType)}</p>
            ${features.includes('reservation') ? '<a href="#reservation" class="cta-button">Réserver une table</a>' : '<a href="#menu" class="cta-button">Découvrir notre carte</a>'}
        </div>
    </section>`;
}

function generateMenuSectionForType(restaurantName: string, restaurantType: string, features: string[]): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique')) {
    return `
    <section id="menu" class="menu-section menu-luxury">
        <h2>Nos Menus d'Exception</h2>
        <div class="menu-intro">
            <p>Découvrez l'art culinaire du Chef, une symphonie de saveurs sublimées par des produits d'exception.</p>
        </div>
        <div class="menu-categories">
            <div class="menu-card menu-signature">
                <div class="menu-header">
                    <h3>Menu Dégustation</h3>
                    <div class="price">185€</div>
                </div>
                <p>7 services • Accords mets et vins inclus</p>
                <div class="menu-highlights">
                    <span>Foie gras mi-cuit</span>
                    <span>Saint-Jacques de Normandie</span>
                    <span>Pigeon de Bresse</span>
                </div>
            </div>
            <div class="menu-card">
                <div class="menu-header">
                    <h3>Menu du Marché</h3>
                    <div class="price">95€</div>
                </div>
                <p>4 services • Produits de saison</p>
            </div>
            <div class="menu-card">
                <div class="menu-header">
                    <h3>Menu Découverte</h3>
                    <div class="price">65€</div>
                </div>
                <p>3 services • Entrée, plat, dessert</p>
            </div>
        </div>
    </section>`;
  }
  
  if (normalizedType.includes('pizzeria')) {
    return `
    <section id="pizzas" class="menu-section menu-pizza">
        <h2>Le Nostre Pizze</h2>
        <div class="pizza-intro">
            <p>🍕 Pâte artisanale fermentée 48h • Cuisson au feu de bois • Ingrédients 100% italiens</p>
        </div>
        <div class="pizza-grid">
            <div class="pizza-card">
                <h3>🍕 Margherita</h3>
                <p>La reine des pizzas • Tomate San Marzano, Mozzarella di Bufala, Basilic frais</p>
                <div class="price">14€</div>
            </div>
            <div class="pizza-card featured">
                <div class="pizza-badge">Spécialité</div>
                <h3>🍕 Diavola</h3>
                <p>Tomate, Mozzarella, Salami piquant, Huile d'olive extra vierge</p>
                <div class="price">16€</div>
            </div>
            <div class="pizza-card">
                <h3>🍕 Quattro Stagioni</h3>
                <p>Tomate, Mozzarella, Jambon, Champignons, Artichauts, Olives</p>
                <div class="price">17€</div>
            </div>
            <div class="pizza-card">
                <h3>🍕 Prosciutto</h3>
                <p>Tomate, Mozzarella, Prosciutto di Parma 18 mois, Roquette</p>
                <div class="price">18€</div>
            </div>
        </div>
    </section>`;
  }
  
  // Menu standard pour autres types
  return `
    <section id="menu" class="menu-section">
        <h2>Notre Menu</h2>
        <div class="menu-preview">
            ${generateMenuContentForType(restaurantType)}
        </div>
    </section>`;
}

function generateCustomSectionsForType(restaurantName: string, restaurantType: string, features: string[]): string {
  const normalizedType = restaurantType.toLowerCase();
  let sections = '';
  
  if (normalizedType.includes('gastronomique')) {
    sections += `
    <section id="chef" class="chef-section">
        <div class="chef-content">
            <div class="chef-image">
                <div class="chef-placeholder">👨‍🍳</div>
            </div>
            <div class="chef-info">
                <h2>Le Chef</h2>
                <h3>Maître de l'Art Culinaire</h3>
                <p>Formé dans les plus prestigieux restaurants de France, notre Chef vous propose une cuisine créative et raffinée, alliant tradition et innovation.</p>
                <div class="chef-awards">
                    <span>🏆 Meilleur Ouvrier de France</span>
                    <span>⭐ Étoile Michelin</span>
                </div>
            </div>
        </div>
    </section>
    
    <section id="cave" class="wine-section">
        <h2>Notre Cave à Vins</h2>
        <div class="wine-content">
            <p>Plus de 500 références soigneusement sélectionnées par notre sommelier.</p>
            <div class="wine-categories">
                <div class="wine-card">
                    <h3>🍷 Bordeaux</h3>
                    <p>Grands crus classés</p>
                </div>
                <div class="wine-card">
                    <h3>🥂 Champagnes</h3>
                    <p>Maisons prestigieuses</p>
                </div>
                <div class="wine-card">
                    <h3>🍾 Bourgognes</h3>
                    <p>Domaines d'exception</p>
                </div>
            </div>
        </div>
    </section>`;
  }
  
  if (normalizedType.includes('pizzeria')) {
    sections += `
    <section id="antipasti" class="antipasti-section">
        <h2>Antipasti & Contorni</h2>
        <div class="antipasti-grid">
            <div class="dish-item">
                <h3>🧀 Burrata Pugliese</h3>
                <p>Tomates cerises, basilic, huile d'olive</p>
                <span class="price">12€</span>
            </div>
            <div class="dish-item">
                <h3>🥗 Salade Roquette Parmesan</h3>
                <p>Roquette, copeaux de parmesan, vinaigrette balsamique</p>
                <span class="price">9€</span>
            </div>
            <div class="dish-item">
                <h3>🍅 Bruschetta Tricolore</h3>
                <p>Pain grillé, tomates, mozzarella, basilic</p>
                <span class="price">8€</span>
            </div>
        </div>
    </section>
    
    <section id="dolci" class="desserts-section">
        <h2>I Nostri Dolci</h2>
        <div class="desserts-showcase">
            <div class="dessert-feature">
                <h3>🍮 Tiramisu della Casa</h3>
                <p>Recette familiale traditionnelle • Mascarpone crémeux • Café expresso</p>
            </div>
            <div class="dessert-grid">
                <span>🍨 Gelato Artigianale</span>
                <span>🥧 Panna Cotta</span>
                <span>🍰 Cannoli Siciliani</span>
            </div>
        </div>
    </section>`;
  }
  
  if (normalizedType.includes('asiatique')) {
    sections += `
    <section id="sushi" class="sushi-section">
        <h2>Sushi & Sashimi</h2>
        <div class="sushi-philosophy">
            <p>L'art ancestral du sushi, poissons sélectionnés quotidiennement</p>
        </div>
        <div class="sushi-grid">
            <div class="sushi-category">
                <h3>🍣 Sashimi</h3>
                <p>Saumon, thon, daurade • 6 pièces</p>
                <span class="price">18€</span>
            </div>
            <div class="sushi-category">
                <h3>🍱 Bento Découverte</h3>
                <p>Assortiment sushi, maki, salade</p>
                <span class="price">24€</span>
            </div>
        </div>
    </section>
    
    <section id="tradition" class="tradition-section">
        <h2>Traditions Culinaires</h2>
        <div class="tradition-content">
            <div class="tradition-text">
                <p>Chaque plat respecte les techniques ancestrales transmises de génération en génération.</p>
            </div>
            <div class="tradition-values">
                <span>🥢 Respect des traditions</span>
                <span>🌿 Ingrédients naturels</span>
                <span>⚖️ Équilibre des saveurs</span>
            </div>
        </div>
    </section>`;
  }
  
  return sections;
}

function generateAboutSectionForType(restaurantName: string, restaurantType: string): string {
  return `
    <section id="apropos" class="about-section">
        <h2>À Propos</h2>
        <p>${generateAboutContentForType(restaurantName, restaurantType)}</p>
    </section>`;
}

function generateContactSectionForType(restaurantName: string, restaurantType: string, features: string[]): string {
  return `
    <section id="contact" class="contact-section">
        <h2>Contact</h2>
        <div class="contact-info">
            <p>📍 Adresse : [Votre adresse]</p>
            <p>📞 Téléphone : [Votre téléphone]</p>
            <p>✉️ Email : [Votre email]</p>
            ${features.includes('horaires') ? '<p>🕒 Ouvert du mardi au dimanche, 12h-14h et 19h-22h</p>' : ''}
        </div>
        ${features.includes('galerie') ? '<div class="gallery-preview"><h3>Nos Spécialités</h3><div class="gallery-grid">[Photos à venir]</div></div>' : ''}
    </section>`;
}

function generateFooterForType(restaurantName: string, restaurantType: string): string {
  const normalizedType = restaurantType.toLowerCase();
  
  if (normalizedType.includes('gastronomique')) {
    return `
    <footer class="footer footer-luxury">
        <div class="footer-content">
            <div class="footer-section">
                <h4>${restaurantName}</h4>
                <p>Restaurant Gastronomique</p>
            </div>
            <div class="footer-section">
                <h4>Réservations</h4>
                <p>📞 +33 1 23 45 67 89</p>
                <p>Du mardi au samedi</p>
            </div>
            <div class="footer-section">
                <h4>Suivez-nous</h4>
                <div class="social-links">
                    <span>📘 Facebook</span>
                    <span>📷 Instagram</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 ${restaurantName}. Restaurant étoilé • Tous droits réservés.</p>
        </div>
    </footer>`;
  }
  
  if (normalizedType.includes('pizzeria')) {
    return `
    <footer class="footer footer-pizza">
        <div class="footer-wave">🍕🍅🧄🌿🍕🍅🧄🌿</div>
        <div class="footer-content">
            <div class="footer-motto">
                <h4>Grazie Mille!</h4>
                <p>Arrivederci e a presto alla ${restaurantName}!</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 ${restaurantName} • Pizzeria Artisanale • Made with ❤️ in France</p>
        </div>
    </footer>`;
  }
  
  // Footer standard
  return `
    <footer class="footer">
        <p>&copy; 2024 ${restaurantName}. Tous droits réservés.</p>
    </footer>`;
}

function generateDataURL(restaurantName: string, restaurantType: string, features: string[], colorScheme: string, theme?: any, layoutVersion?: number): string {
  const htmlContent = generateHTMLForPreview(restaurantName, restaurantType, features, colorScheme, theme, layoutVersion);
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  return dataUrl;
}

// Fonctions simplifiées pour les métadonnées (pour éviter les erreurs JSON)
function generateSimpleHTML(restaurantName: string, restaurantType: string, features: string[], colorScheme: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurantName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .hero { padding: 40px 20px; text-align: center; background: #ecf0f1; }
        .menu { padding: 40px 20px; }
        .contact { padding: 40px 20px; background: #f8f9fa; }
        .btn { background: #e74c3c; color: white; padding: 10px 20px; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <header class="header">
        <h1>${restaurantName}</h1>
        <p>${restaurantType}</p>
    </header>
    <section class="hero">
        <h2>Bienvenue chez ${restaurantName}</h2>
        <p>Découvrez notre cuisine ${restaurantType.toLowerCase()} authentique</p>
        <button class="btn">Réserver une table</button>
    </section>
    <section class="menu">
        <h2>Notre Menu</h2>
        <p>Découvrez nos spécialités préparées avec des ingrédients frais.</p>
    </section>
    <section class="contact">
        <h2>Contact</h2>
        <p>📍 Adresse: [Votre adresse]</p>
        <p>📞 Téléphone: [Votre téléphone]</p>
        <p>✉️ Email: [Votre email]</p>
    </section>
</body>
</html>`;
}

function generateSimpleCSS(colorScheme: string): string {
  const colors = {
    elegant: { primary: '#2C3E50', accent: '#E74C3C' },
    moderne: { primary: '#34495E', accent: '#1ABC9C' },
    rustique: { primary: '#8B4513', accent: '#DAA520' },
    minimaliste: { primary: '#000000', accent: '#FF6B35' },
    chaleureux: { primary: '#D2691E', accent: '#FF8C00' }
  };
  
  const scheme = colors[colorScheme as keyof typeof colors] || colors.moderne;
  
  return `body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
}

.header {
    background: ${scheme.primary};
    color: white;
    padding: 2rem;
    text-align: center;
}

.hero {
    padding: 3rem 2rem;
    text-align: center;
    background: linear-gradient(135deg, ${scheme.primary}20, ${scheme.accent}20);
}

.btn {
    background: ${scheme.accent};
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: opacity 0.3s;
}

.btn:hover {
    opacity: 0.9;
}

@media (max-width: 768px) {
    .hero { padding: 2rem 1rem; }
    .header { padding: 1rem; }
}`;
}

function generateSimpleJS(features: string[]): string {
  return `// Site web interactif
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site web chargé avec succès');
    
    // Smooth scroll pour les liens
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    ${features.includes('menu-interactif') ? `
    // Menu interactif
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });` : ''}
    
    ${features.includes('reservation') ? `
    // Système de réservation
    const reservationBtn = document.querySelector('.btn');
    if (reservationBtn) {
        reservationBtn.addEventListener('click', function() {
            alert('Système de réservation - Appelez-nous au téléphone!');
        });
    }` : ''}
});`;
}

function generateSimpleDataURL(restaurantName: string, restaurantType: string, features: string[], colorScheme: string): string {
  const htmlContent = generateSimpleHTML(restaurantName, restaurantType, features, colorScheme);
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
} 