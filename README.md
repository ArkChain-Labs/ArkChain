# ArkChain

**Infraestructura de mercado secundario privado para equity crowdfunding en LATAM**

![Avalanche Fuji](https://img.shields.io/badge/Avalanche-Fuji%20Testnet-E84142?style=flat-square&logo=avalanche)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat-square&logo=railway)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

**🔗 Demo en vivo:** [https://ark-chain.vercel.app](https://ark-chain.vercel.app)  
**📂 Repo:** [github.com/ArkChain-Labs/ArkChain](https://github.com/ArkChain-Labs/ArkChain)  
**⛓️ Contratos en Fuji:** Ver sección [Contratos desplegados](#contratos-desplegados-en-avalanche-fuji)

---

## ¿Qué es ArkChain?

ArkChain es infraestructura de mercado secundario privado para equity crowdfunding en América Latina. Permite que inversionistas que han participado en rondas de financiamiento colectivo (crowdfunding de equity) de startups puedan comprar y vender sus posiciones entre sí, sin esperar a un IPO o adquisición que puede tardar 7 a 10 años, o nunca llegar.

En el modelo actual, cuando un inversionista pone $5,000 MXN en una startup a través de una plataforma como Arkangeles, ese capital queda completamente ilíquido. No hay mercado secundario. No hay precio de referencia. No hay forma de salir antes de un evento de liquidez. ArkChain construye ese mercado.

El diferenciador técnico central de ArkChain es la **privacidad selectiva**: los balances y transferencias de equity son privados para el mercado general (competidores, empleados, proveedores no deben conocer la estructura de capital de una startup) pero completamente transparentes y auditables para el regulador que posea la llave de auditor. Esto se implementa mediante tokens **eERC20** desarrollados por Ava Labs, que soportan un "auditor mode" nativo. La verificación de compliance (KYC/AML) se hace en tiempo real a través de **Wavy Node**, bloqueando automáticamente transacciones con participantes que no cumplen el umbral de riesgo.

---

## El problema

### 1. Capital atrapado sin mecanismo de salida

El mercado de PE y VC en LATAM tiene **$49.2 mil millones en AUM** (Preqin, 2023). Las distribuciones a inversionistas cayeron al **11% del NAV en 2024**, el nivel más bajo en más de una década. La mediana del tiempo desde una inversión Seed hasta un exit es de **7.5 años** (AngelList, 2024). Para el inversionista retail de equity crowdfunding, ese capital está congelado indefinidamente.

### 2. No existe mercado secundario en LATAM

En ninguno de los 6 países objetivo (México, Brasil, Argentina, Colombia, Chile, Perú) existe un mercado secundario privado funcional para posiciones de equity crowdfunding. BEE4 en Brasil es el único precedente institucional, con R$5 millones en volumen secundario acumulado desde 2022, sin privacidad de cap table y sin compliance automático.

### 3. La privacidad bloquea la transparencia regulatoria

Las empresas privadas no pueden exponer públicamente su cap table (confidencialidad competitiva), pero los reguladores exigen transparencia total. Sin resolver esta tensión, no puede existir un mercado secundario legalmente válido. Esta es la barrera que el eERC20 de Avalanche resuelve mediante criptografía.

---

## La solución

ArkChain provee tres capacidades que juntas hacen posible el mercado secundario de equity privado en LATAM:

### 🔐 Emisión de tokens de equity (eERC20)
Los emisores (startups) tokenizan su equity en tokens **eERC20** que son privados por defecto. Los balances están cifrados en la blockchain: un observador externo ve que existen transacciones, pero no cuántos tokens transfiere quién, ni a qué precio. La startup mantiene confidencialidad de su cap table mientras la infraestructura de mercado existe on-chain.

### 📊 Mercado secundario con compliance integrado
El **OrderBook** on-chain permite a inversionistas publicar órdenes de venta y compra. Cada transacción pasa por **Wavy Node** antes de ejecutarse: si el score de riesgo del comprador o vendedor está por debajo del umbral (score < 60 / 100), la transacción se bloquea automáticamente y en tiempo real. No hay compliance manual, no hay días de espera, no hay fricciones que hagan inviables los tickets pequeños.

### 🏛️ Auditor mode para reguladores
El regulador (CNBV en México, CVM en Brasil, SFC en Colombia, etc.) recibe una **llave de auditor eERC20**. Con esa llave, puede ver todos los balances descifrados, el historial completo de transacciones, y los scores de Wavy Node de cada participante. El regulador tiene visibilidad total mientras el mercado opera con privacidad. Este es el mecanismo que hace que ArkChain pueda existir dentro del marco legal vigente en cada jurisdicción.

---

## ¿Por qué Avalanche?

| Capacidad | Ethereum | Solana | **Avalanche** |
|---|---|---|---|
| Finality | ~12 minutos | ~400ms | **< 2 segundos** |
| EVM Compatible | ✅ Nativo | ❌ No | ✅ Nativo |
| Subnets / L1s dedicadas | ❌ | ❌ | ✅ Clave para jurisdicciones |
| eERC20 con auditor mode | ❌ | ❌ | ✅ **Nativo en ava-labs** |
| Costo por transacción | Alto ($5-50) | Muy bajo | **Bajo y predecible** |
| Adopción institucional RWA | Parcial | Emergente | **$3.4B+ tokenizados** |
| Franklin Templeton / Progmat | ❌ | ❌ | ✅ Ambos |

El eERC20 desarrollado por Ava Labs es el único token estándar EVM-compatible con privacidad selectiva y auditor mode incorporados a nivel de protocolo. No es un add-on ni un wrapper: es el mecanismo de privacidad diseñado específicamente para casos de uso regulados. Este estándar no existe en Ethereum ni en Solana.

La adopción institucional de Avalanche por Franklin Templeton (FOBXX, agosto 2024), KKR, Apollo Global, Progmat/MUFG ($2B+ migrando a Avalanche en 2025-2026) y el lanzamiento de AVAX Futures en el CME (mayo 2026) validan que la infraestructura elegida por ArkChain es la misma que eligen las instituciones financieras más grandes del mundo para tokenización de activos.

---

## Demo en vivo

**URL:** [https://ark-chain.vercel.app](https://ark-chain.vercel.app)

La demo corre con datos mock realistas sobre Avalanche Fuji Testnet. No se requiere wallet real ni fondos para navegar las primeras dos vistas.

### Las 3 vistas del sistema

**🧳 Vista Inversionista — `/app/portafolio`**
- Portafolio con holdings activos (FintechMX, LogiPay, AgroTech) con valores cifrados por defecto
- Modal de venta: cantidad y precio, verificación Wavy Node animada (800ms) antes de publicar la orden
- Historial de eventos corporativos recientes (dividendos, splits, rondas)

**📈 Vista Marketplace — `/app/marketplace`**
- Órdenes de venta activas con risk badge Wavy Node por cada vendedor
- Modal de compra con verificación Wavy Node (900ms animado) y detalle de transacción
- Confirmación y actualización del portafolio del comprador

**🏢 Vista Emisor — `/app/emisor/cap-table`**
- Cap table completo con 20 holders (fundadores, VCs, retail, reserva, treasury)
- Distribución visual en barra apilada con leyenda agregada por categoría
- Tabla scrollable con dirección on-chain de cada holder
- Generador de eventos corporativos y reportes de trades secundarios

**🏛️ Vista Regulador — `/app/regulador`**
- Header CNBV Modo Auditor Activo con timestamp sincronizado
- Tabla de auditoría completa con balances descifrados, scores Wavy Node coloreados, transacción bloqueada en rojo
- Panel comparativo "Vista inversionista (cifrado) vs. Vista CNBV (descifrado)" — la misma transacción con y sin llave de auditor
- Generador de reportes: CSV descargable, PDF via impresión nativa del browser, XBRL notificado como próximo
- Log de accesos a la llave de auditor (registro inmutable de cada uso)

---

## Arquitectura técnica

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                               │
│              (Inversionista · Emisor · Regulador CNBV)              │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────────────┐
│                    FRONTEND (Vercel)                                 │
│              Next.js 15 · Tailwind v4 · shadcn/ui                   │
│         wagmi + viem · TanStack Query · WalletConnect               │
│                                                                     │
│  /app/portafolio     /app/marketplace     /app/emisor               │
│  /app/regulador      /login               /                         │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ REST API (HTTPS)
┌─────────────────────────▼───────────────────────────────────────────┐
│                     BACKEND (Railway)                                │
│                   Node.js · Express · TypeScript                    │
│                                                                     │
│  GET  /api/holdings/:address      POST /api/orders                  │
│  GET  /api/orders/:companyId      POST /api/orders/:id/execute      │
│  GET  /api/audit/events           GET  /api/portfolio/:address      │
│  POST /api/reports/generate       GET  /api/captable/:companyId     │
│                                                                     │
│  Auditor API Key para endpoints del regulador (header auth)         │
└──────────┬──────────────────────────────────┬───────────────────────┘
           │ ethers.js / viem                  │ HTTP
           │ JSON-RPC Fuji                     │
┌──────────▼──────────────┐       ┌────────────▼──────────────────────┐
│   AVALANCHE FUJI        │       │        WAVY NODE                  │
│   (Testnet · 43113)     │       │   Risk Scoring API                │
│                         │       │   KYC · AML · Score 0-100         │
│  EncryptedERC (eERC20)  │       │   Score < 60 → bloqueo automático │
│  Registrar              │       └───────────────────────────────────┘
│  OrderBook              │
│  MockUSDC               │
│  ZK Verifiers (5x)      │
└─────────────────────────┘
```

### Contratos desplegados en Avalanche Fuji

| Contrato | Dirección | Función |
|---|---|---|
| **EncryptedERC** | `0x0aD47d0e825BfcFbeD6048615eA697E10964AFb2` | Token eERC20 con privacidad y auditor mode |
| **Registrar** | `0x5acCC50Af240b25A9f63Bd34A4Ae0ffD7d178D54` | Registro ZK de wallets de inversores |
| **OrderBook** | `0xb15638921DB21c5e4b1C8Bd85CaE9FC0960ABC10` | Mercado secundario on-chain |
| **MockUSDC** | `0x6aE098cCDC0098D7106A7Ed9428D78564d97CBED` | Stablecoin de prueba para liquidación |
| RegistrationVerifier | `0xB8f90c6b2FFdc3a744E1283B4e726dC6775330d9` | Verificador ZK de registro |
| MintVerifier | `0x302Bb3B26651989929b2204F8A7c5181Ea15E3c4` | Verificador ZK de emisión |
| TransferVerifier | `0x1BD023642A410Daff43a5d9A759cdfA876fF6bCF` | Verificador ZK de transferencia |
| WithdrawVerifier | `0xe15E0Ee0E93eEe19CF68B46d122A99eeE093bC8e` | Verificador ZK de retiro |
| BurnVerifier | `0x29679D988B54Fe9646f2cD6bBfEd575037c10F0c` | Verificador ZK de quema |

**Auditor address (demo CNBV):** `0x67bFA2Dc3bC228fC4947683CC7f10ad1527acd77`  
**Issuer address (demo FintechMX):** `0x47bFb16F80E892d8BC2dC7aaE2312979e4016B17`  
**Red:** Avalanche Fuji Testnet · Chain ID: 43113 · Desplegado: 2026-05-16  
Ver contratos en [Snowtrace Testnet](https://testnet.snowtrace.io/address/0x0aD47d0e825BfcFbeD6048615eA697E10964AFb2).

---

## Stack tecnológico

| Tecnología | Uso | Por qué |
|---|---|---|
| **Next.js 15** | Frontend + routing | App Router, server components, deploy nativo en Vercel |
| **Tailwind CSS v4** | Estilos | CSS variables nativas, zero-config, performance óptima |
| **shadcn/ui (base-ui)** | Componentes | Accesibilidad, composable, sin dependencias innecesarias |
| **wagmi + viem** | Web3 wallet integration | Type-safe, tree-shakeable, soporte nativo Avalanche |
| **WalletConnect v3** | Multi-wallet | Estándar de industria para DApps móviles y desktop |
| **TanStack Query** | Server state | Cache, refetch, optimistic updates para datos on-chain |
| **Node.js + Express** | Backend API | Simplicidad, performance, ecosistema maduro |
| **Railway** | Backend hosting | Deploy automático desde git, variables de entorno seguras |
| **Vercel** | Frontend hosting | CDN global, preview deployments, integración nativa Next.js |
| **Solidity 0.8.x** | Smart contracts | Estándar EVM, tooling maduro (Hardhat + ethers.js) |
| **Hardhat** | Compilación y deploy | Scripting TypeScript, Fuji deploy automatizado |
| **circom + snarkjs** | ZK circuits | Registro, mint, transfer, withdraw, burn con privacidad |
| **Avalanche Fuji** | Testnet | EVM-compatible, finality < 2s, eERC20 nativo |
| **eERC20 (ava-labs)** | Privacy tokens | Único estándar con auditor mode incorporado |
| **Wavy Node** | Risk scoring | KYC/AML en tiempo real, score 0-100, bloqueo automático |

---

## Modelo de negocio

ArkChain tiene tres fuentes de ingreso que se activan secuencialmente conforme escala:

### 1. Take rate de mercado secundario — 2.5% por transacción
Cada vez que un inversionista vende su posición de equity en el OrderBook de ArkChain, la plataforma captura 2.5% del valor de la transacción. Este modelo es el mismo que usan Forge Global (5%), EquityZen (5%) y Nasdaq Private Market (3-5%) en USA. ArkChain tiene pricing competitivo para LATAM dado el ticket promedio menor.

### 2. SaaS para emisores — $200-$500 USD/mes
Las startups que emiten tokens en ArkChain pagan una suscripción mensual que incluye cap table digital on-chain, reportes regulatorios (formato CNBV-1437), gestión de eventos corporativos, y analytics de su mercado secundario. Benchmark: Carta cobra $800-$2,000/mes en USA.

### 3. Compliance API — Revenue share con Wavy Node
En Fase 2, ArkChain monetiza el acceso a la integración con Wavy Node para plataformas CFI que quieran compliance automático sin integrar ArkChain completo.

### Proyección de ARR

| Año | Plataformas | Volumen transaccional | ARR estimado |
|---|---|---|---|
| Año 1 (2026-2027) | 1 (Arkangeles) | ~$168K USD | ~$52K USD |
| Año 2 (2027-2028) | 7 (MX + BR piloto) | ~$11.2M USD | ~$640K USD |
| Año 3 (2028-2029) | 15+ (6 países) | ~$75M USD | ~$3.3M USD |

*Ver supuestos detallados y benchmarks de mercado en [MARKET.md](./MARKET.md)*

---

## Go-to-market

La estrategia es **infrastructure-first**, no marketplace-first. ArkChain no construye la red de compradores y vendedores desde cero: se conecta a las redes que ya existen (plataformas CFI con sus inversores) y provee la capa de liquidez.

### Q3 2026 — Piloto Arkangeles + sandbox CNBV
- Integración técnica con Arkangeles para tokenizar cap table de 5-10 startups piloto
- Solicitud de entrada al sandbox regulatorio de la CNBV (México)
- Primera transacción secundaria real en Avalanche Fuji

### Q4 2026 — Pre-seed + auditoría de contratos
- Ronda pre-seed $500K-$1M USD
- Auditoría de smart contracts (Trail of Bits / OpenZeppelin)
- Integración con custodio fiduciario (Bankaool, partner del hackathon)
- Onboarding de 2-3 IFCs adicionales en México

### Q1 2027 — Entrada a Brasil
- Partnership con Kria o EqSeed como plataforma âncora
- Adaptación del auditor mode para CVM bajo Resolución 88

### Q2 2027 — Argentina y Colombia
- Argentina: compatible con CNV RG 1125/2026 y 1137/2026 (tokenización habilitada)
- Colombia: integración con a2censo (Bolsa de Valores de Colombia)

### Q3 2027 — Chile y Perú
- Chile: integración con Broota como plataforma pan-regional
- Perú: ingreso vía Afluenta Perú
- Objetivo: $75M+ en volumen anual, 15+ plataformas integradas

---

## Regulatorio

El problema regulatorio central del mercado secundario de equity privado es la tensión entre la privacidad corporativa y la transparencia exigida por los reguladores. ArkChain la resuelve con el **auditor mode del eERC20**.

### Flujo de compliance

1. **KYC del inversionista** — La plataforma CFI ya verifica identidad al onboardear. ArkChain hereda ese KYC vía API.
2. **Registro ZK on-chain** — El inversionista registra su wallet mediante ZK proof. La blockchain sabe que está autorizado sin revelar identidad pública.
3. **Risk scoring en tiempo real** — Cada transacción dispara verificación Wavy Node (score 0-100). Score < 60 bloquea la transacción automáticamente.
4. **Visibilidad regulatoria** — El regulador descifra balances y transacciones con su llave de auditor eERC20. Sin esa llave, los datos son indescifrable incluso en blockchain pública.

### Estado regulatorio por país

| País | Regulador | Marco aplicable | Estado |
|---|---|---|---|
| México | CNBV | Ley Fintech 2018 | Piloto Q3 2026 |
| Brasil | CVM | Resolución CVM 88 (2022) | Piloto Q1 2027 |
| Argentina | CNV | RG 1125/2026 + RG 1137/2026 | Compatible hoy |
| Colombia | SFC | Decreto 1235/2020 | Piloto Q2 2027 |
| Chile | CMF | Ley 21.130/2019 | Piloto Q3 2027 |
| Perú | SMV | Reglamento SMV 2020 | Piloto Q3 2027 |

---

## Roadmap post-hackathon

| Milestone | Descripción | Timeline |
|---|---|---|
| **Auditoría smart contracts** | Trail of Bits / OpenZeppelin audit | Q4 2026 |
| **ZK proof en producción** | Resolver trusted setup · prover Go deployado | Q4 2026 |
| **Custodio fiduciario** | Integración Bankaool para firmas legales de transferencia | Q4 2026 |
| **Sandbox CNBV México** | Solicitud formal · aprobación estimada 3-6 meses | Q1 2027 |
| **Mainnet Avalanche** | Migración de Fuji a C-Chain mainnet post-auditoría | Q1 2027 |
| **Dictámenes legales** | Opiniones legales en MX y BR sobre tokens como valores | Q1-Q2 2027 |
| **SDK público v1** | Documentación y SDK para integración de plataformas CFI | Q2 2027 |
| **DREX (Brasil)** | Compatibilidad con Real Digital del Banco Central do Brasil | Q3 2027 |

---

## Equipo

| Rol | Responsabilidades |
|---|---|
| **Smart Contracts & ZK** | EncryptedERC, Registrar, OrderBook, circom circuits, ZK verifiers, Hardhat deploy |
| **Backend Engineer** | API Node.js/Express, integración blockchain, Wavy Node, Railway infra |
| **Frontend Engineer** | Next.js app, 4 vistas (inversionista, emisor, regulador, marketplace), UX/UI |
| **Producto & Pitch** | Estrategia, go-to-market, relación con partners, validación regulatoria |

**Partners del hackathon:**
- [**Arkangeles**](https://arkangeles.com) — Plataforma de equity crowdfunding líder en México (15,000 inversores, 100+ startups)
- **Bankaool** — Banco digital mexicano; custodio fiduciario observador en el piloto
- **Wavy Node** — Risk scoring KYC/AML en tiempo real con score 0-100
- **Oracle** — Infraestructura de datos para pricing y eventos corporativos
- [**Avalanche / Ava Labs**](https://avax.network) — Blockchain, eERC20 estándar, soporte técnico del hackathon

---

## Recursos y links

| Recurso | URL |
|---|---|
| Demo en vivo | [https://ark-chain.vercel.app](https://ark-chain.vercel.app) |
| Repositorio | [github.com/ArkChain-Labs/ArkChain](https://github.com/ArkChain-Labs/ArkChain) |
| EncryptedERC en Snowtrace | [testnet.snowtrace.io](https://testnet.snowtrace.io/address/0x0aD47d0e825BfcFbeD6048615eA697E10964AFb2) |
| OrderBook en Snowtrace | [testnet.snowtrace.io](https://testnet.snowtrace.io/address/0xb15638921DB21c5e4b1C8Bd85CaE9FC0960ABC10) |
| eERC20 by Ava Labs | [github.com/ava-labs/EncryptedERC](https://github.com/ava-labs/EncryptedERC) |
| Avalanche Builder Hub | [build.avax.network](https://build.avax.network) |
| Addresses desplegadas | [addresses.json](./addresses.json) |
| Validación de mercado | [MARKET.md](./MARKET.md) |

---

## Setup para desarrolladores

### Requisitos previos
- Node.js ≥ 18
- Wallet Avalanche Fuji (MetaMask con Fuji: RPC `https://api.avax-test.network/ext/bc/C/rpc`, Chain ID `43113`)
- AVAX Fuji para gas ([faucet.avax.network](https://faucet.avax.network))

### Frontend (Next.js)

```bash
git clone https://github.com/ArkChain-Labs/ArkChain.git
cd ArkChain/arkchain
npm install
cp .env.example .env.local
# Editar .env.local con tus keys
npm run dev
# → http://localhost:3000
```

### Backend (Express)

```bash
cd ArkChain/backend
npm install
cp .env.example .env
npm run dev
# → http://localhost:3001
```

### Contratos (Hardhat + Fuji)

```bash
cd ArkChain/contracts
npm install
cp .env.example .env
# Agregar FUJI_PRIVATE_KEY en .env
npx hardhat compile
npx hardhat run scripts/deploy.ts --network fuji
# Las addresses se guardan en addresses.json (raíz del repo)
```

### Variables de entorno clave

**`arkchain/.env.local`**
```env
NEXT_PUBLIC_USE_MOCK=true          # true para demo con datos mock
NEXT_PUBLIC_WC_PROJECT_ID=...      # WalletConnect project ID
BACKEND_URL=https://arkchain-production.up.railway.app
AUDITOR_API_KEY=...
```

**`backend/.env`**
```env
PORT=3001
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
ENCRYPTED_ERC_ADDRESS=0x0aD47d0e825BfcFbeD6048615eA697E10964AFb2
ORDER_BOOK_ADDRESS=0xb15638921DB21c5e4b1C8Bd85CaE9FC0960ABC10
AUDITOR_API_KEY=...
WAVY_NODE_API_KEY=...
```

---

## Licencia

MIT — ver [LICENSE](./LICENSE) para detalles.

---

*Hackathon LatAm Institucional de Avalanche · 15-17 de mayo de 2026*  
*Partners: Arkangeles · Bankaool · Wavy Node · Oracle · Avalanche*
