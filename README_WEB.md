# Chat IA - Version Web

Interface web moderne pour interagir avec les agents IA du projet Let Him Cook AI.

## 🚀 Démarrage rapide

### 1. Configuration des variables d'environnement

Créez ou modifiez le fichier `.env.local` à la racine du projet :

```env
# URL de l'API du serveur Express
API_URL=http://localhost:8080

# Token d'authentification (optionnel)
BEARER=votre-token-ici
```

### 2. Démarrage des services

#### Option A: Développement avec hot-reload

```bash
# Terminal 1 : Démarrer le serveur Express
npm run dev

# Terminal 2 : Démarrer l'interface web Next.js
npm run dev-next
```

#### Option B: Production

```bash
# Terminal 1 : Démarrer le serveur Express
npm run server

# Terminal 2 : Construire et démarrer l'interface web
npm run build
npm run start
```

### 3. Accéder à l'interface

Ouvrez votre navigateur et allez sur :
- **Développement**: http://localhost:3000
- **Production**: http://localhost:3000

## 🎯 Fonctionnalités

### Interface utilisateur
- ✅ **Sélection d'agents** : Choisissez parmi les agents disponibles
- ✅ **Chat en temps réel** : Messages avec streaming en direct
- ✅ **Design responsive** : Compatible mobile et desktop
- ✅ **Mode sombre** : Thème adaptatif selon les préférences système
- ✅ **Historique** : Conservation des messages dans la session
- ✅ **Gestion d'erreurs** : Messages d'erreur informatifs

### Agents disponibles
Les agents sont automatiquement chargés depuis le registre du serveur Express. Chaque agent a :
- Un **nom** et une **description**
- Des **capacités spécifiques** (météo, analyse, etc.)
- Un **contexte persistant** par conversation

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `API_URL` | URL du serveur Express | `http://localhost:8080` |
| `BEARER` | Token d'authentification (optionnel) | `your-secret-token` |

### Structure des fichiers web

```
src/
├── app/
│   ├── api/chat/
│   │   └── route.ts        # API proxy vers le serveur Express
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Interface de chat
│   └── globals.css         # Styles globaux
└── lib/                    # Utilitaires (si nécessaire)
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion au serveur**
   - Vérifiez que le serveur Express est démarré (`npm run dev` ou `npm run server`)
   - Vérifiez l'URL dans `.env.local`

2. **Agents non chargés**
   - Vérifiez la configuration des agents dans `CLI/agents_config.json`
   - Vérifiez les logs du serveur Express

3. **Erreur d'authentification**
   - Vérifiez le token BEARER dans `.env.local`
   - Assurez-vous qu'il correspond à celui dans `CLI/.env`

## 📱 Utilisation

1. **Sélectionner un agent** : Cliquez sur l'agent souhaité dans la section "Choisir un agent"
2. **Écrire un message** : Tapez votre message dans la zone de texte
3. **Envoyer** : Appuyez sur Entrée ou cliquez sur "Envoyer"
4. **Suivre la réponse** : La réponse de l'agent apparaît en temps réel
5. **Continuer la conversation** : Les messages suivants gardent le contexte

## 🔄 Intégration avec le CLI

L'interface web utilise la même API que le CLI, donc :
- Les conversations web et CLI sont séparées (thread IDs différents)
- Les agents sont les mêmes
- La configuration d'authentification peut être partagée

## 📊 Monitoring

Pour voir les logs en temps réel :

```bash
# Logs du serveur Express
npm run dev

# Logs de Next.js
npm run dev-next
```

## 🚀 Déploiement

Pour déployer en production, assurez-vous de :
1. Configurer les variables d'environnement correctes
2. Construire l'application Next.js : `npm run build`
3. Démarrer les deux services (Express + Next.js) 