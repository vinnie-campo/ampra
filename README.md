# Ampra - Home Battery Installation Platform

**Power. Secured.**

A modern, full-stack platform for selling and installing residential battery systems (Tesla Powerwall). Built with Next.js 14, TypeScript, and Tailwind CSS.

![Ampra Logo](public/brand/logo.svg)

## 🎨 Brand Identity

**Name:** Ampra (from "Ampere" - the unit of electrical current)

**Tagline:** Power. Secured.

**Colors:**
- **Ampra Blue** - Primary: `#2563EB`
- **Volt Green** - Accent: `#4ADE80`
- **Slate** - Neutrals

**Typography:** Plus Jakarta Sans

See `BRAND_GUIDE.md` for complete brand guidelines.

---

## 🏗️ Architecture

Three interconnected applications:

### 1. Marketing & Quote Site (`/`)
- Modern landing page with product information
- Multi-step quote calculator with personalized recommendations
- Instant pricing with 30% federal tax credit calculations

### 2. Customer Portal (`/portal`)
- Authenticated dashboard for customers
- Dominos-style progress tracker for installation status
- Document upload for virtual site surveys
- Payment tracking

### 3. Admin CRM (`/admin`)
- Lead management and scoring
- Project pipeline tracking
- Automated workflow triggers

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── quote/                # Quote calculator
│   ├── portal/               # Customer portal
│   │   ├── dashboard/
│   │   ├── documents/
│   │   └── payments/
│   └── admin/                # Admin CRM
│       ├── leads/
│       └── projects/
├── components/
│   ├── ui/                   # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── utils.ts
│   └── store.ts              # Zustand state
└── types/
    └── index.ts

public/
└── brand/                    # Logo assets
    ├── logo.svg
    ├── logomark.svg
    └── logo-white.svg
```

---

## 🔧 Key Features

### Quote Calculator
- Address and property details
- Solar system detection
- Critical appliance selection
- Real-time price calculation
- Federal 30% ITC applied

### Battery Configurations
| Config | Capacity | Typical Backup |
|--------|----------|----------------|
| 1 Powerwall 3 | 13.5 kWh | 12-24 hours |
| + 1 Extension | 27 kWh | 24-48 hours |
| + 2 Extensions | 40.5 kWh | 48+ hours |

### Customer Portal
- 5-step progress tracker (Site Survey → Permitting → Installation → Interconnection → Go Live)
- Photo/video upload for virtual site survey
- Payment tracking

---

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/quote` | Quote calculator |
| `/portal/dashboard` | Customer dashboard |
| `/portal/documents` | Document upload |
| `/admin` | Admin dashboard |
| `/admin/leads` | Lead management |

---

## 🔌 Integration Ready

The platform is designed for:
- **Supabase** - Database, Auth, Storage
- **Stripe** - Payments
- **Resend** - Email automation

---

## 📄 License

MIT

---

Built with ⚡ by Ampra Energy
