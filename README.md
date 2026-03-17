# SRK University - Nx Monorepo

<div align="center">

[![Nx](https://img.shields.io/badge/Nx-22.1.0-143055?style=flat-square&logo=nx&logoColor=white)](https://nx.dev)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-22.17.1-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)

A modern, scalable monorepo architecture for SRK University's learning management system, built with cutting-edge technologies and best practices.

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 About The Project

SRK University is a comprehensive learning management platform that provides course management, student enrollment, affiliate marketing, payment processing, and administrative tools. This project is built as an Nx monorepo to enable:

- **Code Reusability**: Shared libraries across multiple applications
- **Scalability**: Easy addition of new apps and features
- **Maintainability**: Centralized dependency management and consistent tooling
- **Developer Experience**: Fast builds, intelligent caching, and powerful CLI tools

### Key Features

- 🎓 Course management system with video streaming
- 👥 User authentication and authorization (Auth0 + JWT)
- 💳 Payment integration for course subscriptions
- 📊 Admin dashboard with analytics
- 🤝 Affiliate marketing system with commission tracking
- 📧 Email notifications and automated workflows
- 📱 Fully responsive design with Tailwind CSS
- 🔥 Real-time updates and data synchronization

---

## 🛠 Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 22.17.1 | JavaScript runtime |
| **npm** | 11.6.0 | Package manager |
| **TypeScript** | 5.9.2 | Type-safe JavaScript |
| **Nx** | 22.1.0 | Monorepo build system |

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 7.0.0 | Build tool & dev server |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **NextUI** | 2.6.11 | React component library |
| **React Router** | 7.9.6 | Client-side routing |
| **React Hook Form** | 7.66.1 | Form management |
| **Zustand** | 5.0.8 | State management |
| **TanStack Query** | 5.90.10 | Server state management |
| **Framer Motion** | 11.18.2 | Animations |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 4.21.2 | Web framework |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | 8.20.1 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Nodemailer** | 6.10.1 | Email service |
| **Node-cron** | 3.0.3 | Job scheduling |

### Additional Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Auth0** | 2.9.0 | Authentication provider |
| **Firebase** | 11.10.0 | Cloud services |
| **Cloudinary** | 2.8.0 | Media management |
| **Axios** | 1.13.2 | HTTP client |
| **Zod** | 3.25.76 | Schema validation |
| **Jest** | 30.0.2 | Testing framework |
| **ESLint** | 9.8.0 | Code linting |

---

## 🏗 Architecture

This project follows an Nx monorepo architecture with the following structure:

```
srk-monorepo/
├── apps/
│   ├── university/          # React frontend application
│   └── backend/             # Express API server
└── libs/
    └── shared/
        ├── ui-components/   # Reusable React components
        ├── hooks/          # Custom React hooks
        ├── utils/          # Utility functions
        ├── store/          # Zustand state stores
        ├── api/            # API client & services
        ├── types/          # TypeScript type definitions
        └── assets/         # Static assets
```

### Design Principles

- **DRY (Don't Repeat Yourself)**: Shared code lives in `libs/shared/`
- **Separation of Concerns**: Clear boundaries between frontend, backend, and shared code
- **Type Safety**: TypeScript across the entire codebase
- **Scalability**: Easy to add new apps (e.g., mobile app, admin portal)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Check versions
node --version    # Should be >= 18.x.x (recommended: 22.17.1)
npm --version     # Should be >= 8.x.x (recommended: 11.6.0)
```

If you need to install or update:

- **Node.js**: Download from [nodejs.org](https://nodejs.org)
- **npm**: Comes with Node.js (or use `npm install -g npm@latest`)

### System Requirements

- **OS**: macOS, Linux, or Windows with WSL2
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 2GB free space

---

## 🚀 Getting Started

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-workspace
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies for both frontend and backend applications, as well as shared libraries.

### 3. Set Up Environment Variables

#### Frontend Environment (University App)

1. Copy the example environment file:
   ```bash
   cp apps/university/example.env apps/university/.env
   ```

2. Edit `apps/university/.env` and fill in the required values:
   ```env
   # MongoDB Package ID for PRO subscription
   VITE_PRO_PACKAGE_ID=your_mongodb_objectid_here
   
   # Firebase Configuration (from Firebase Console)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   
   # Application URLs
   VITE_FRONTEND_ROOT_URL=http://localhost:4200  # Dev environment
   VITE_BACKEND_ROOT_URL=http://localhost:3000   # Dev environment
   ```

#### Backend Environment

1. Copy the example environment file:
   ```bash
   cp apps/backend/example.env apps/backend/.env
   ```

2. Edit `apps/backend/.env` and fill in the required values:
   ```env
   # MongoDB Connection
   DATABASE_URL=mongodb://localhost:27017/srk_university
   
   # Email Configuration (Gmail App Password)
   APP_EMAIL=your-email@gmail.com
   SMTP_PW=your_gmail_app_password
   
   # Application Settings
   FRONTEND_BASE_URL=http://localhost:4200
   
   # Security
   JWT_SECRET=your_jwt_secret_here  # Generate with: openssl rand -hex 32
   WHITE_LISTED_ORIGINS=http://localhost:4200,http://localhost:3000
   
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. **Generate JWT Secret** (required):
   ```bash
   openssl rand -hex 32
   ```
   Copy the output and paste it as the `JWT_SECRET` value.

### 4. Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB:
   ```bash
   # macOS
   brew install mongodb-community
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install mongodb
   ```

2. Start MongoDB:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. Use connection string in `.env`:
   ```env
   DATABASE_URL=mongodb://localhost:27017/srk_university
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and add it to `.env`:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/srk_university?retryWrites=true&w=majority
   ```

### 5. Fix MongoDB Index Issue (If Needed)

If you encounter a duplicate key error on the `uid_1` index:

```bash
npx tsx apps/backend/src/utils/script/dropUidIndex.ts
```

This script removes the obsolete `uid_1` index from the users collection.

### 6. Start Development Servers

#### Option 1: Start Both Apps Simultaneously

```bash
npm run start:all
```

#### Option 2: Start Apps Individually

**Terminal 1 - Frontend:**
```bash
npm run start:university
```
Frontend will be available at: http://localhost:4200

**Terminal 2 - Backend:**
```bash
npm run start:backend
```
Backend API will be available at: http://localhost:3000

### 7. Verify Installation

1. Open http://localhost:4200 in your browser
2. You should see the SRK University homepage
3. Check the browser console for any errors
4. Test backend by visiting http://localhost:3000/api/health (if health endpoint exists)

---

## 🔐 Environment Variables

### Frontend Variables (`apps/university/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_PRO_PACKAGE_ID` | MongoDB ObjectId for PRO subscription package | `507f1f77bcf86cd799439011` |
| `VITE_FIREBASE_API_KEY` | Firebase API key from Firebase Console | `AIzaSyXXXXXXXXXXXXXXXXX` |
| `VITE_FRONTEND_ROOT_URL` | Frontend application URL | `http://localhost:4200` |
| `VITE_BACKEND_ROOT_URL` | Backend API URL | `http://localhost:3000` |

### Backend Variables (`apps/backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/srk_university` |
| `APP_EMAIL` | Gmail address for sending emails | `noreply@example.com` |
| `SMTP_PW` | Gmail app password (not regular password) | `abcd efgh ijkl mnop` |
| `FRONTEND_BASE_URL` | Frontend URL for CORS and redirects | `http://localhost:4200` |
| `JWT_SECRET` | Secret key for JWT token signing | Generate with `openssl rand -hex 32` |
| `WHITE_LISTED_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:4200,http://localhost:3000` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `srk-university-12345` |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | `firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Copy values from the downloaded JSON file to your `.env`

### Getting Gmail App Password

1. Enable 2-factor authentication on your Gmail account
2. Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Copy the 16-character password to `SMTP_PW`

---

## 💻 Development

### Running Tests

```bash
# Run all tests
npm run test:all

# Run frontend tests
npm run test:university

# Run backend tests
npm run test:backend

# Run tests in watch mode
nx test university --watch
```

### Linting Code

```bash
# Lint all projects
npm run lint:all

# Lint frontend
npm run lint:university

# Lint backend
npm run lint:backend

# Auto-fix linting issues
nx lint university --fix
```

### Formatting Code

```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run format:check
```

### Adding New Dependencies

```bash
# Add to frontend
npm install <package-name> --workspace=apps/university

# Add to backend
npm install <package-name> --workspace=apps/backend

# Add to shared library
npm install <package-name> --workspace=libs/shared/ui-components

# Add dev dependency at root
npm install -D <package-name>
```

### Creating New Shared Components

1. Create your component in `libs/shared/ui-components/src/lib/`
2. Export it from `libs/shared/ui-components/src/index.ts`
3. Import in your app:
   ```tsx
   import { MyComponent } from '@srk/shared/ui-components';
   ```

### Hot Module Replacement (HMR)

Both frontend and backend support hot reloading:
- **Frontend**: Vite HMR (instant updates)
- **Backend**: Nodemon (restarts on file changes)

---

## 📦 Building for Production

### Build All Projects

```bash
npm run build:all
```

### Build Individual Projects

```bash
# Build frontend
npm run build:university

# Build backend
npm run build:backend
```

### Output Locations

- **Frontend**: `dist/apps/university/`
- **Backend**: `dist/apps/backend/`

### Production Environment Variables

**Important**: Create separate `.env` files for production with real values:

1. Use production URLs (no localhost)
2. Generate strong JWT secrets
3. Use MongoDB Atlas connection string
4. Set proper CORS origins

Example production `.env`:
```env
# Frontend
VITE_FRONTEND_ROOT_URL=https://university.example.com
VITE_BACKEND_ROOT_URL=https://api.example.com

# Backend
DATABASE_URL=mongodb+srv://prod-user:password@cluster.mongodb.net/production
FRONTEND_BASE_URL=https://university.example.com
WHITE_LISTED_ORIGINS=https://university.example.com
```

---

## 📁 Project Structure

```
my-workspace/
├── apps/
│   ├── university/                     # Frontend React App
│   │   ├── src/
│   │   │   ├── app/                   # App-level components
│   │   │   ├── pages/                 # Page components
│   │   │   ├── components/            # App-specific components
│   │   │   ├── hooks/                 # App-specific hooks
│   │   │   ├── store/                 # Local state management
│   │   │   ├── utils/                 # App utilities
│   │   │   └── main.tsx               # Entry point
│   │   ├── public/                    # Static assets
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── example.env                # Environment template
│   │   └── project.json               # Nx project config
│   │
│   └── backend/                        # Backend Express API
│       ├── src/
│       │   ├── controller/            # Route controllers
│       │   ├── model/                 # Mongoose models
│       │   ├── modules/               # Feature modules
│       │   ├── services/              # Business logic
│       │   ├── utils/                 # Utilities & helpers
│       │   ├── config/                # Configuration
│       │   ├── contract/              # API contracts
│       │   ├── app.ts                 # Express app setup
│       │   └── main.ts                # Server entry point
│       ├── example.env                # Environment template
│       └── project.json               # Nx project config
│
├── libs/
│   └── shared/                         # Shared Libraries
│       ├── ui-components/             # Reusable React components
│       │   └── src/lib/
│       │       ├── ReusableComponents.tsx
│       │       ├── Navbar.tsx
│       │       ├── Footer.tsx
│       │       ├── SideBar.tsx
│       │       └── ...
│       │
│       ├── hooks/                     # Custom React hooks
│       │   └── src/
│       │       ├── useInView.ts
│       │       ├── useAlert.ts
│       │       ├── useFileUpload.ts
│       │       └── ...
│       │
│       ├── utils/                     # Utility functions
│       │   └── src/
│       │       ├── methods.ts
│       │       ├── utils.ts
│       │       ├── validation.ts
│       │       └── localstorage/
│       │
│       ├── store/                     # Global state (Zustand)
│       │   └── src/
│       │       ├── useAuth.tsx
│       │       └── useSidebarToggle.tsx
│       │
│       ├── api/                       # API client & services
│       │   └── src/
│       │       ├── apiClient.ts
│       │       ├── firebase.ts
│       │       └── api/endpoints.ts
│       │
│       ├── types/                     # TypeScript types
│       │   └── src/index.ts
│       │
│       └── assets/                    # Static assets
│           └── src/
│               ├── images/
│               ├── fonts/
│               └── icons/
│
├── nx.json                            # Nx workspace configuration
├── tsconfig.base.json                 # TypeScript base config
├── tailwind.config.js                 # Tailwind root config
├── postcss.config.js                  # PostCSS configuration
├── package.json                       # Dependencies & scripts
└── README.md                          # This file
```

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:university` | Start frontend dev server |
| `npm run start:backend` | Start backend dev server |
| `npm run start:all` | Start both frontend and backend |
| `npm run build:university` | Build frontend for production |
| `npm run build:backend` | Build backend for production |
| `npm run build:all` | Build all projects |
| `npm run test:university` | Run frontend tests |
| `npm run test:backend` | Run backend tests |
| `npm run test:all` | Run all tests |
| `npm run lint:university` | Lint frontend code |
| `npm run lint:backend` | Lint backend code |
| `npm run lint:all` | Lint all projects |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without changes |

### Nx Commands

```bash
# Visualize project dependencies
npx nx graph

# Show project details
npx nx show project university

# Run specific target for a project
npx nx <target> <project>
npx nx serve university
npx nx build backend

# Run target for multiple projects
npx nx run-many -t build
npx nx run-many -t test --projects=university,backend

# Clear Nx cache
npx nx reset
```

---

## 🚀 Deployment to DigitalOcean App Platform

This guide walks you through deploying both the backend API and frontend React app to DigitalOcean App Platform.

### Prerequisites

- DigitalOcean account ([Sign up here](https://cloud.digitalocean.com/registrations/new))
- GitHub repository with your code
- MongoDB Atlas database (recommended for production)
- Firebase project configured
- Domain name (optional, but recommended)

### Architecture Overview

We'll deploy two separate apps:
1. **Backend API** (`/apps/backend`) - Node.js Express server
2. **Frontend** (`/apps/university`) - React static site

---

### Step 1: Prepare MongoDB Atlas

Before deploying, set up a production database:

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free tier cluster (M0)

2. **Configure Network Access**
   - In MongoDB Atlas: Network Access → Add IP Address
   - **Important**: Add `0.0.0.0/0` to allow access from anywhere (DigitalOcean IPs are dynamic)
   - Or add specific DigitalOcean datacenter IP ranges

3. **Create Database User**
   - Database Access → Add New Database User
   - Choose password authentication
   - Save credentials securely

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
   - Keep this for environment variables

---

### Step 2: Prepare Your Repository

1. **Push Code to GitHub**
   ```bash
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit"
   
   # Add remote and push
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

2. **Verify Repository Structure**
   Ensure your repository has:
   - `/apps/backend/` - Backend application
   - `/apps/university/` - Frontend application
   - `/libs/shared/` - Shared libraries
   - `package.json` at root
   - `nx.json` configuration

---

### Step 3: Deploy Backend API

#### 3.1 Create Backend App on DigitalOcean

1. **Login to DigitalOcean**
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Navigate to **Apps** section
   - Click **Create App**

2. **Connect GitHub Repository**
   - Choose **GitHub** as source
   - Authorize DigitalOcean to access your repositories
   - Select your repository
   - Choose branch (usually `main` or `master`)
   - **Enable "Autodeploy"** for automatic deployments on push

3. **Configure Backend Service**
   - DigitalOcean will auto-detect your app
   - Click **Edit** next to detected service
   
   **Configure as follows:**
   
   | Setting | Value |
   |---------|-------|
   | **Name** | `srk-backend` or `backend-api` |
   | **Source Directory** | `/` (root, because it's a monorepo) |
   | **Environment** | `Node.js` |
   | **Build Command** | `npm install && npx nx build backend` |
   | **Run Command** | `node dist/apps/backend/main.js` |
   | **HTTP Port** | `3000` (or `8080`) |
   | **HTTP Request Routes** | `/` |
   | **Instance Type** | Basic (512MB RAM) or Professional (1GB RAM) |

#### 3.2 Configure Backend Environment Variables

In the **Environment Variables** section, add:

```bash
# MongoDB Connection
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/srk_production?retryWrites=true&w=majority

# Email Configuration
APP_EMAIL=your-production-email@gmail.com
SMTP_PW=your_gmail_app_password

# Application URLs (will update after frontend deployment)
FRONTEND_BASE_URL=https://your-frontend-url.ondigitalocean.app

# Security
JWT_SECRET=your_production_jwt_secret_here
WHITE_LISTED_ORIGINS=https://your-frontend-url.ondigitalocean.app,https://your-custom-domain.com

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n

# Node Environment
NODE_ENV=production
PORT=8080
```

**Important Notes:**
- Use **strong, unique** JWT secret (generate with `openssl rand -hex 32`)
- Escape newlines in `FIREBASE_PRIVATE_KEY` as `\n`
- Update `FRONTEND_BASE_URL` after deploying frontend
- Mark sensitive variables as **encrypted** in DigitalOcean

#### 3.3 Configure Health Checks (Optional but Recommended)

- **Health Check Path**: `/api/health` (if you have a health endpoint)
- **Timeout**: 30 seconds

#### 3.4 Review and Deploy

- Review all settings
- Click **Create Resources**
- Wait 5-10 minutes for deployment
- Once deployed, you'll get a URL like: `https://srk-backend-xxxxx.ondigitalocean.app`

#### 3.5 Verify Backend Deployment

```bash
# Test your backend API
curl https://srk-backend-xxxxx.ondigitalocean.app/api/health

# Check if server is responding
curl -I https://srk-backend-xxxxx.ondigitalocean.app
```

---

### Step 4: Deploy Frontend (React App)

#### 4.1 Create Frontend App on DigitalOcean

1. **Create New App** or **Add Component**
   - If creating new app: Follow same GitHub connection steps
   - If adding to existing app: Click **Add Component** → **From Source Code**

2. **🚨 CRITICAL: Choose Component Type**
   
   When DigitalOcean auto-detects your app, it may incorrectly identify it as a "Web Service". You **MUST** manually change this to "Static Site".
   
   **How to change:**
   - Click **Edit** next to the auto-detected component
   - Find **"Resource Type"** or **"Component Type"** dropdown
   - Select **"Static Site"** (NOT "Web Service")

3. **Configure Frontend Service**
   
   | Setting | Value |
   |---------|-------|
   | **Name** | `srk-university` or `frontend` |
   | **Type** | **Static Site** 🚨 CRITICAL: Must be "Static Site" |
   | **Source Directory** | `/` (root, because it's a monorepo) |
   | **Environment** | `Node.js` (only used for build) |
   | **Build Command** | `npm install && npx nx build university` |
   | **Output Directory** | `dist/apps/university` 🚨 REQUIRED for static sites |
   | **Run Command** | ❌ _Leave EMPTY_ (do NOT add any command) |
   | **HTTP Port** | ❌ _Not applicable_ (remove if present) |
   | **HTTP Request Routes** | `/` |

   **Key Difference from Backend:**
   - **Backend** = Web Service (runs Node.js server continuously with `node` command)
   - **Frontend** = Static Site (just serves pre-built HTML/CSS/JS files from output directory)
   
   **Common Mistake:** If you see "Run Command" or "HTTP Port" fields, you've selected "Web Service" by mistake. Change to "Static Site"!

#### 4.2 Configure Frontend Environment Variables

Add these environment variables:

```bash
# Backend API URL (from previous step)
VITE_BACKEND_ROOT_URL=https://srk-backend-xxxxx.ondigitalocean.app

# Frontend URL (will be your DigitalOcean URL or custom domain)
VITE_FRONTEND_ROOT_URL=https://srk-university-xxxxx.ondigitalocean.app

# MongoDB Package ID
VITE_PRO_PACKAGE_ID=your_mongodb_objectid_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Node Environment
NODE_ENV=production
```

#### 4.3 Configure Static Site Settings

For a React SPA, you need to handle client-side routing:

1. In **Settings** → **App-Level Configuration**
2. Add a **Catchall Route** to handle React Router:
   - Create a `_redirects` file or configure in DigitalOcean UI
   - Rule: `/* /index.html 200`

**Alternative**: Create `apps/university/public/_redirects` file:
```
/*    /index.html   200
```

#### 4.4 Deploy Frontend

- Click **Save** and **Deploy**
- Wait 5-10 minutes for build and deployment
- You'll get a URL like: `https://srk-university-xxxxx.ondigitalocean.app`

#### 4.5 Update Backend CORS Settings

Now that you have the frontend URL, update backend environment variables:

1. Go to backend app settings
2. Update these variables:
   ```bash
   FRONTEND_BASE_URL=https://srk-university-xxxxx.ondigitalocean.app
   WHITE_LISTED_ORIGINS=https://srk-university-xxxxx.ondigitalocean.app
   ```
3. Save and redeploy backend

---

### Step 5: Custom Domain Setup (Optional)

#### 5.1 Add Custom Domain to Frontend

1. **In DigitalOcean App Settings**
   - Go to your frontend app
   - Click **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain: `university.yourdomain.com`

2. **Configure DNS Records**
   
   In your domain registrar (Namecheap, GoDaddy, etc.):
   
   | Type | Name | Value |
   |------|------|-------|
   | CNAME | university | `srk-university-xxxxx.ondigitalocean.app.` |
   | A | @ | DigitalOcean IP (if using root domain) |

3. **SSL Certificate**
   - DigitalOcean automatically provisions Let's Encrypt SSL
   - Wait 5-15 minutes for SSL to activate

#### 5.2 Add Custom Domain to Backend

1. **Add Domain to Backend App**
   - Go to backend app
   - Settings → Domains → Add Domain
   - Enter: `api.yourdomain.com`

2. **Configure DNS**
   
   | Type | Name | Value |
   |------|------|-------|
   | CNAME | api | `srk-backend-xxxxx.ondigitalocean.app.` |

#### 5.3 Update Environment Variables with Custom Domains

**Frontend `.env`:**
```bash
VITE_FRONTEND_ROOT_URL=https://university.yourdomain.com
VITE_BACKEND_ROOT_URL=https://api.yourdomain.com
```

**Backend `.env`:**
```bash
FRONTEND_BASE_URL=https://university.yourdomain.com
WHITE_LISTED_ORIGINS=https://university.yourdomain.com,https://www.yourdomain.com
```

Redeploy both apps after updating.

---

### Step 6: Post-Deployment Verification

#### 6.1 Test Backend API

```bash
# Test API health
curl https://api.yourdomain.com/api/health

# Test API endpoint (example)
curl https://api.yourdomain.com/api/users

# Check CORS headers
curl -I -X OPTIONS https://api.yourdomain.com/api/users \
  -H "Origin: https://university.yourdomain.com" \
  -H "Access-Control-Request-Method: GET"
```

#### 6.2 Test Frontend

1. Open `https://university.yourdomain.com` in browser
2. Open Developer Console (F12)
3. Check for errors
4. Test key features:
   - User registration/login
   - Course browsing
   - API calls to backend

#### 6.3 Monitor Application Logs

**DigitalOcean Logs:**
1. Go to your app in DigitalOcean
2. Click **Runtime Logs**
3. Monitor for errors or warnings

**Set Up Alerts:**
1. Settings → Alerts
2. Configure alerts for:
   - High CPU usage
   - Memory usage
   - Build failures
   - App crashes

---

### Step 7: Continuous Deployment

With autodeploy enabled, every push to your main branch will trigger:

1. **Automatic Build**
2. **Run Tests** (if configured)
3. **Deploy** (if tests pass)

**Workflow:**
```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# DigitalOcean automatically:
# 1. Detects push
# 2. Builds app
# 3. Deploys (if successful)
```

---

### Step 8: Database Migration (If Needed)

If you have existing data, migrate to MongoDB Atlas:

```bash
# Export from old database
mongodump --uri="mongodb://localhost:27017/srk_university" --out=./backup

# Import to MongoDB Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/srk_production" ./backup
```

Or run the index cleanup script:
```bash
# Set production DATABASE_URL in local .env temporarily
npx tsx apps/backend/src/utils/script/dropUidIndex.ts
```

---

### Troubleshooting Deployment

#### Frontend Deployment: "failed to launch: determine start command"

**Problem**: 
```
ERROR: failed to launch: determine start command: when there is no default process a command is required
ERROR failed health checks after 1 attempts with error Readiness probe failed: dial tcp 10.244.34.146:8080: connect: connection refused
```

**Root Cause**: DigitalOcean is treating your frontend as a "Web Service" instead of a "Static Site"

**Solutions:**

1. **Delete and recreate the component:**
   - Go to your app in DigitalOcean
   - Delete the frontend component
   - Click **"Add Component"** → **"From Source Code"**
   - When it auto-detects, click **"Edit"**
   - **CHANGE "Resource Type" to "Static Site"** (dropdown at the top)
   
2. **Verify these settings:**
   ```
   Type: Static Site (NOT Web Service)
   Build Command: npm install && npx nx build university
   Output Directory: dist/apps/university
   Run Command: [LEAVE EMPTY - do not add anything]
   HTTP Port: [REMOVE if present]
   ```

3. **Double-check the Output Directory:**
   - Must be exactly: `dist/apps/university`
   - No leading `/` slash
   - This is where Vite outputs the built files

**Why this happens:**
- DigitalOcean sees Node.js and assumes it's a server
- "Web Service" requires a run command and port
- "Static Site" just needs build output location
- Static sites are served via CDN, no server needed

**Visual Guide:**
- ✅ Correct: `Type: Static Site` + `Output Directory: dist/apps/university`
- ❌ Wrong: `Type: Web Service` + `Run Command: node ...`

#### Build Fails

**Problem**: `Build failed: npm ERR! code ELIFECYCLE`

**Solutions:**
- Check build command is correct: `npm install && npx nx build backend`
- Verify all dependencies are in `package.json` (not just devDependencies)
- Check build logs in DigitalOcean for specific error
- Try building locally first: `npm run build:backend`

#### Backend Crashes on Startup

**Problem**: App crashes immediately after deployment

**Solutions:**
- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Check logs for stack trace
- Ensure `PORT` environment variable is set to `8080`
- Verify run command: `node dist/apps/backend/main.js`

#### Frontend Shows Blank Page

**Problem**: Frontend loads but shows blank page

**Solutions:**
- Check browser console for errors
- Verify `VITE_*` environment variables are set
- Ensure backend URL is correct and API is responding
- Check if `_redirects` file exists for SPA routing
- Verify output directory is `dist/apps/university`

#### CORS Errors

**Problem**: `Access to fetch blocked by CORS policy`

**Solutions:**
- Verify `WHITE_LISTED_ORIGINS` includes your frontend URL
- Check backend CORS configuration in `app.ts`
- Ensure frontend is using correct backend URL
- Try adding both `www` and non-`www` versions to whitelist

#### MongoDB Connection Timeout

**Problem**: `MongooseServerSelectionError: connection timed out`

**Solutions:**
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify connection string has correct username/password
- Check database user has read/write permissions
- Ensure `retryWrites=true&w=majority` in connection string

#### Environment Variables Not Loading

**Problem**: Variables showing as `undefined`

**Solutions:**
- Verify all variables are set in DigitalOcean app settings
- Frontend variables MUST start with `VITE_`
- Redeploy after adding/changing variables
- Check for typos in variable names
- Don't use quotes around values in DigitalOcean UI

---

### Cost Estimation

**Basic Setup (Recommended for starting):**
- **Backend**: Basic (512MB RAM) - $5/month
- **Frontend**: Static Site - $0-3/month (depending on bandwidth)
- **Total**: ~$5-8/month

**Professional Setup:**
- **Backend**: Professional (1GB RAM) - $12/month
- **Frontend**: Static Site - $0-3/month
- **Total**: ~$12-15/month

**Additional Costs:**
- **MongoDB Atlas**: Free tier (M0) - $0/month
- **Domain**: ~$10-15/year
- **Bandwidth**: Included (1TB on basic, more on professional)

---

### Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files to git
   - Use different secrets for dev and production
   - Rotate JWT secrets periodically

2. **CORS Configuration**
   - Only whitelist necessary origins
   - Don't use `*` in production

3. **Database Security**
   - Use strong database passwords
   - Restrict IP access in MongoDB Atlas
   - Enable audit logging

4. **SSL/HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Use secure cookies

5. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times
   - Set up uptime monitoring

---

### Useful Commands

```bash
# View deployment logs
doctl apps logs <app-id> --follow

# Restart app
doctl apps restart <app-id>

# List all apps
doctl apps list

# Get app info
doctl apps get <app-id>

# Update environment variable
doctl apps update <app-id> --env-var KEY=VALUE
```

---

### Next Steps After Deployment

1. **Set up monitoring** with tools like UptimeRobot or Pingdom
2. **Configure error tracking** with Sentry
3. **Set up analytics** with Google Analytics or Mixpanel
4. **Create backups** of your MongoDB database
5. **Document API** with Swagger/OpenAPI
6. **Set up CI/CD** for automated testing before deployment
7. **Configure CDN** for static assets (DigitalOcean Spaces)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::4200`

**Solution**:
```bash
# Find process using port 4200
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use different port
nx serve university --port 4201
```

#### 2. MongoDB Connection Failed

**Problem**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check connection string in `.env`
- Verify network access in MongoDB Atlas (if using cloud)
- Check firewall settings

#### 3. Duplicate Key Error (uid_1)

**Problem**: `E11000 duplicate key error collection: users index: uid_1`

**Solution**:
```bash
npx tsx apps/backend/src/utils/script/dropUidIndex.ts
```

#### 4. Tailwind Styles Not Applying

**Problem**: Classes not working or "content paths not matched" warning

**Solutions**:
- Verify `tailwind.config.js` content paths include all source files
- Clear Nx cache: `npx nx reset`
- Restart dev server
- Check PostCSS configuration

#### 5. Module Not Found Errors

**Problem**: `Cannot find module '@srk/shared/ui-components'`

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check tsconfig.base.json paths are correct
# Restart TypeScript server in VSCode: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

#### 6. Environment Variables Not Loaded

**Problem**: `undefined` values for environment variables

**Solutions**:
- Ensure `.env` files exist (copy from `example.env`)
- Frontend variables must start with `VITE_`
- Restart dev servers after changing `.env`
- Check for syntax errors in `.env` (no spaces around `=`)

#### 7. Build Errors

**Problem**: TypeScript or build failures

**Solutions**:
```bash
# Clear Nx cache
npx nx reset

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

### Getting Help

- **Nx Documentation**: [nx.dev/getting-started](https://nx.dev/getting-started)
- **GitHub Issues**: Report bugs in the repository
- **Team Chat**: Contact the development team

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests: `npm run test:all`
4. Run linting: `npm run lint:all`
5. Format code: `npm run format`
6. Commit changes: `git commit -m "feat: add your feature"`
7. Push to branch: `git push origin feature/your-feature-name`
8. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed and maintained by the SRK University Development Team.

---

<div align="center">

**Built with ❤️ using Nx, React, and Node.js**

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues)

</div>
