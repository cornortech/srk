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

This will install all dependencies for both frontend and backend applications, as well as shared libraries.

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
