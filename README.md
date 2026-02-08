# 🇹🇬 Freelance Togo

Plateforme de mise en relation entre freelances et entreprises au Togo, spécialisée dans les métiers d'ingénierie.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Architecture](#-architecture)
- [Contribution](#-contribution)
- [Licence](#-licence)

## ✨ Fonctionnalités

### Pour les Freelances
- ✅ Profil professionnel complet (portfolio, expériences, certifications)
- ✅ Recherche et candidature aux projets
- ✅ Messagerie intégrée
- ✅ Gestion des avis clients
- ✅ Notifications en temps réel

### Pour les Entreprises
- ✅ Publication de projets
- ✅ Recherche de freelances par compétences
- ✅ Gestion des candidatures
- ✅ Système de favoris
- ✅ Évaluation des freelances

### Fonctionnalités Générales
- 🔐 Authentification sécurisée (NextAuth.js)
- 📧 Vérification email
- 💬 Système de messagerie
- 🔔 Notifications
- ⭐ Système d'avis et de notes
- 📱 Interface responsive

## 🛠 Stack Technique

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentification**: [NextAuth.js v4](https://next-auth.js.org/)
- **Base de données**: [MongoDB](https://www.mongodb.com/) avec [Mongoose](https://mongoosejs.com/)
- **Stockage**: [Cloudinary](https://cloudinary.com/) (images/fichiers)
- **Email**: [Resend](https://resend.com/)
- **Validation**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Styling**: CSS Modules

## 📦 Prérequis

- **Node.js**: 18.x ou supérieur
- **npm**: 9.x ou supérieur
- **MongoDB**: Instance locale ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Compte Cloudinary**: Pour le stockage d'images
- **Compte Resend**: Pour l'envoi d'emails

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/freelance-togo.git
cd freelance-togo
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et le remplir avec vos valeurs:

```bash
cp .env.example .env.local
```

Voir la section [Configuration](#-configuration) pour les détails.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## ⚙️ Configuration

### Variables d'Environnement Requises

Créer un fichier `.env.local` à la racine du projet avec les variables suivantes:

#### MongoDB
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelance-togo
```

**Comment obtenir:**
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Aller dans "Database Access" → Créer un utilisateur
4. Aller dans "Network Access" → Ajouter votre IP (ou 0.0.0.0/0 pour dev)
5. Cliquer sur "Connect" → "Connect your application" → Copier l'URI

#### NextAuth.js
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_genere_ici
```

**Comment générer le secret:**
```bash
openssl rand -base64 32
```

#### Cloudinary
```bash
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Comment obtenir:**
1. Créer un compte sur [Cloudinary](https://cloudinary.com/)
2. Aller dans "Dashboard"
3. Copier les valeurs "Cloud Name", "API Key", "API Secret"

#### Resend (Email)
```bash
RESEND_API_KEY=re_votre_api_key
```

**Comment obtenir:**
1. Créer un compte sur [Resend](https://resend.com/)
2. Aller dans "API Keys"
3. Créer une nouvelle clé

### Variables Optionnelles

```bash
# URL publique de l'application (pour les emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email expéditeur
EMAIL_FROM=noreply@freelance-togo.com
```

## 💻 Développement

### Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Démarrer le serveur de production
npm start

# Linter
npm run lint
```

### Structure du Projet

```
freelance-togo/
├── src/
│   ├── app/                    # Pages et routes (App Router)
│   │   ├── api/               # Routes API
│   │   ├── auth/              # Pages d'authentification
│   │   ├── dashboard/         # Dashboard utilisateur
│   │   ├── projects/          # Gestion des projets
│   │   ├── freelances/        # Recherche de freelances
│   │   └── ...
│   ├── components/            # Composants React réutilisables
│   │   ├── ui/               # Composants UI de base
│   │   └── ...
│   ├── lib/                   # Utilitaires et helpers
│   │   ├── mongodb.js        # Connexion MongoDB
│   │   ├── email.js          # Service d'email
│   │   └── ...
│   └── models/                # Modèles Mongoose
│       ├── User.js
│       ├── Project.js
│       ├── FreelanceProfile.js
│       └── ...
├── public/                    # Assets statiques
├── .env.local                 # Variables d'environnement (non versionné)
├── .env.example              # Exemple de variables
├── next.config.mjs           # Configuration Next.js
└── package.json
```

### Modèles de Données Principaux

- **User**: Utilisateur de base (email, password, role)
- **FreelanceProfile**: Profil détaillé du freelance
- **CompanyProfile**: Profil de l'entreprise
- **Project**: Projet publié par une entreprise
- **ProjectApplication**: Candidature d'un freelance à un projet
- **Message/Conversation**: Système de messagerie
- **Review**: Avis sur un freelance
- **Notification**: Notifications utilisateur
- **Favorite**: Favoris des entreprises

## 🌐 Déploiement

### Déploiement sur Vercel (Recommandé)

1. **Créer un compte sur [Vercel](https://vercel.com/)**

2. **Importer le projet**
   - Cliquer sur "New Project"
   - Importer depuis GitHub/GitLab
   - Sélectionner le repository

3. **Configurer les variables d'environnement**
   - Aller dans "Settings" → "Environment Variables"
   - Ajouter toutes les variables de `.env.local`
   - **Important**: Changer `NEXTAUTH_URL` vers votre domaine de production

4. **Déployer**
   - Cliquer sur "Deploy"
   - Vercel build et déploie automatiquement

### Configuration Post-Déploiement

1. **MongoDB Atlas**: Ajouter l'IP de Vercel dans "Network Access"
2. **Cloudinary**: Vérifier les quotas
3. **Resend**: Configurer le domaine pour les emails
4. **NextAuth**: Mettre à jour `NEXTAUTH_URL` avec le domaine de production

### Variables d'Environnement Production

```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=secret_different_de_dev
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## 🏗 Architecture

### Flow d'Authentification

```
1. Inscription → Création User + envoi email vérification
2. Clic lien email → Vérification token → User.isVerified = true
3. Connexion → NextAuth session
4. Setup profil → Création FreelanceProfile ou CompanyProfile
```

### Flow de Projet

```
1. Entreprise crée projet → Project (status: open)
2. Freelance candidate → ProjectApplication (status: pending)
3. Entreprise accepte → ProjectApplication (status: accepted)
4. Projet complété → Project (status: completed)
5. Entreprise laisse avis → Review
```

### API Routes

Toutes les routes API sont dans `src/app/api/`:

- `/api/auth/*` - Authentification (NextAuth)
- `/api/projects` - CRUD projets
- `/api/applications` - Gestion candidatures
- `/api/freelances` - Recherche freelances
- `/api/messages` - Messagerie
- `/api/notifications` - Notifications
- `/api/reviews` - Avis

Documentation complète: voir [docs/API.md](docs/API.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer:

1. **Fork le projet**
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit les changements** (`git commit -m 'Add some AmazingFeature'`)
4. **Push vers la branche** (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Guidelines

- Suivre les conventions de code existantes
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire
- Utiliser des messages de commit clairs

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion:

- **Email**: contact@freelance-togo.com
- **Website**: [https://freelance-togo.com](https://freelance-togo.com)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework
- [MongoDB](https://www.mongodb.com/) pour la base de données
- [Vercel](https://vercel.com/) pour l'hébergement
- La communauté open-source

---

Fait avec ❤️ au Togo 🇹🇬
