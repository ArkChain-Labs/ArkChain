# ArkChain Frontend

Mercado secundario privado para equity crowdfunding LATAM.

## Stack
- Next.js 16 App Router · TypeScript
- Tailwind CSS v4 + shadcn/ui
- wagmi + viem + RainbowKit (Avalanche Fuji)
- TanStack Query · Zustand

## Quick start
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Cómo conectar el backend real
Toda la data viene de `lib/api/*.ts`. Cada función tiene un flag `USE_MOCK` controlado por `NEXT_PUBLIC_USE_MOCK`. Para conectar el backend:
1. Pon `NEXT_PUBLIC_USE_MOCK=false` en `.env.local`
2. Implementa el cuerpo real de cada función en `lib/api/`
3. Componentes y hooks no cambian.

## Roles
- `/app/portafolio` → Inversionista
- `/app/emisor/cap-table` → Emisor (FintechMX)
- `/app/regulador/auditoria` → Regulador (CNBV) — auditor mode
- `/app/regulador/reportes` → Generador de reportes

Switcher de rol en sidebar. Estado persistido en localStorage.
