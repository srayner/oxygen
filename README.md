# Next Skeleton

A production-ready Next.js starter skeleton with authentication, role-based authorization, and a professional admin dashboard layout.

## Tech Stack

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Strict mode enabled
- **Tailwind CSS** - Semantic color tokens
- **shadcn/ui** - Professional UI components
- **NextAuth v5** - Credentials authentication with JWT sessions
- **Prisma** - PostgreSQL ORM

## Features

- User authentication (login/register)
- Role-based authorization (user/admin)
- Protected routes with middleware
- Collapsible sidebar navigation
- Dark/light theme support
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` with your database connection string and NextAuth secret:

```
DATABASE_URL="postgresql://user:password@localhost:5432/next_skeleton?schema=public"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key-here"
```

Generate a secret with:
```bash
openssl rand -base64 32
```

3. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

4. Seed the database with default users:

```bash
npm run db:fixtures
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Users

| Role  | Email               | Password    |
|-------|---------------------|-------------|
| User  | user@example.com    | password123 |
| Admin | admin@example.com   | admin123    |

## Available Scripts

| Script          | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start development server             |
| `npm run build` | Build for production                 |
| `npm run start` | Start production server              |
| `npm run lint`  | Run ESLint                           |
| `npm run format`| Format code with Prettier            |
| `npm run db:generate` | Generate Prisma client         |
| `npm run db:migrate`  | Run database migrations        |
| `npm run db:fixtures` | Reset and seed database        |

## Project Structure

```
next-skeleton/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── fixtures.ts            # Seed script
├── app/
│   ├── globals.css            # Theme CSS variables
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   ├── (auth)/                # Auth pages (login, register)
│   ├── (protected)/           # Protected pages (dashboard, settings, admin)
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # AppShell, Sidebar, TopNav
│   ├── auth/                  # LoginForm, RegisterForm
│   └── providers/             # ThemeProvider, SessionProvider
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Utilities
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript declarations
└── middleware.ts              # Route protection
```

## Customization

### Theme

Edit `app/globals.css` to customize the color scheme. The theme uses CSS variables for both light and dark modes.

### Sidebar Navigation

Edit `components/layout/app-sidebar.tsx` to modify navigation items. Admin-only items are automatically hidden for non-admin users.

### Adding Protected Routes

1. Create your page in `app/(protected)/your-route/page.tsx`
2. The middleware automatically protects all routes under `(protected)`
3. For admin-only routes, add a role check in the page component

## License

MIT
