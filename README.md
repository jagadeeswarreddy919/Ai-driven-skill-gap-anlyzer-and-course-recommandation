# 🚀 SkillGap AI — AI-Driven Skill Gap Analyzer & Course Recommendation Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)

**SkillGap AI** is an intelligent career readiness platform designed to benchmark technical skills, identify critical skill gaps against 20+ industry-standard technical roles, generate step-by-step learning roadmaps, and recommend curated courses to help developers reach their target career goals.

---

## ✨ Key Features

- 🎯 **Step-by-Step Skill Gap Analyzer**: Select from 20+ target roles (Full Stack Developer, AI Engineer, Data Scientist, DevOps Engineer, etc.) and check off existing skills to compute an instant readiness match score.
- 📊 **Priority Skill Gap Breakdown**: Categorizes missing skills into *Critical*, *High*, and *Medium* priority items with actionable insights.
- 📚 **Curated Course Recommendations**: Direct links to top-tier courses, official documentation, and video tutorials tailored to missing skills.
- 🗺️ **Personalized Learning Roadmaps**: Week-by-week objective-based roadmaps with progress tracking.
- 📄 **Pro Feature — Resume Analyzer**: Extract technical skills directly from uploaded PDF resumes and calculate target role readiness.
- 🤖 **Pro Feature — AI Career Coach**: Interactive, context-aware AI career assistant providing personalized career advice.
- 🔐 **Secure Authentication**:
  - Email & Password sign-up and log-in with bcrypt password hashing and Zod validation.
  - **Google OAuth 2.0 Integration**: One-click Google authentication with an interactive environment setup guide.
  - **Stateless HMAC-SHA256 Session Tokens**: Fault-tolerant authentication engineered specifically for Vercel Serverless Functions.
- 💳 **Flexible Subscriptions & Billing**: Free, Standard, and Pro tier quotas with Razorpay integration and usage management.
- ⚙️ **Comprehensive Settings & Profile Management**: Update personal info, target career goals, password, notification preferences, and danger zone controls.

---

## 🛠️ Tech Stack

- **Frontend & Server Components**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & Animations**: Tailwind CSS v4, Framer Motion, Lucide React Icons
- **Database & ORM**: Prisma ORM v6 with SQLite (Development & Vercel `/tmp` Serverless Auto-Initialization) or PostgreSQL (Production)
- **Validation**: Zod schema validation
- **Authentication**: Custom HMAC-SHA256 signed session tokens & Google OAuth 2.0
- **Deployment Platform**: Vercel

---

## 📁 Repository Architecture

```text
├── prisma/
│   ├── schema.prisma       # Database models (User, Account, Session, Role, Skill, Assessment, etc.)
│   ├── seed.ts             # Seeding script for 110+ skills, 20 roles, and learning resources
│   └── template.db         # Pre-seeded database template for Vercel serverless auto-initialization
├── src/
│   ├── app/
│   │   ├── (app)/          # Authenticated app layout (/dashboard, /analyzer, /roles, /skills, /profile, /settings)
│   │   ├── api/            # Serverless API routes (auth, profile, google oauth, billing, career coach)
│   │   ├── login/          # Log In page with Google OAuth & email authentication
│   │   ├── signup/         # Build career profile / sign up page
│   │   ├── onboarding/     # Initial career profile setup
│   │   └── page.tsx        # Public landing page
│   ├── components/
│   │   ├── app/            # AppSidebar, AppHeader layout navigation
│   │   ├── auth/           # GoogleOAuthModal, AuthHeaderFooter, PasswordStrengthMeter
│   │   └── ...             # Landing page section components
│   └── lib/
│       ├── auth.ts         # Stateless HMAC session token creation & verification
│       ├── db.ts           # Serverless SQLite auto-copy (/tmp/skillgap.db) & Prisma client initialization
│       └── validations.ts  # Zod schemas for login and signup
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js 18.x or 20.x
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jagadeeswarreddy919/Ai-driven-skill-gap-anlyzer-and-course-recommandation.git
   cd "Ai-driven-skill-gap-anlyzer-and-course-recommandation"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Optional: Google OAuth Client ID & Secret
   GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Initialize and Seed the Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Vercel Deployment & Environment Setup

To deploy on **Vercel**:

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Configure **Environment Variables** in Vercel Project Settings:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `NEXTAUTH_URL`: Your Vercel domain (e.g. `https://ai-driven-skill-gap-anlyzer-and-cou.vercel.app`)
3. Add Authorized Redirect URI in Google Cloud Console:
   `https://ai-driven-skill-gap-anlyzer-and-cou.vercel.app/api/auth/google/callback`
4. Trigger a deployment. The build command automatically runs `prisma generate && next build`, initializing database tables seamlessly in serverless execution.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
