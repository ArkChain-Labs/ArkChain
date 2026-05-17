# ArkChain — Validación de Mercado
> Infraestructura de mercado secundario privado para equity crowdfunding en LATAM sobre Avalanche

**Versión:** 1.0 · Mayo 2026 · Hackathon LatAm Institucional Avalanche  
**Países objetivo:** México · Brasil · Argentina · Colombia · Chile · Perú

---

## Resumen ejecutivo

El capital privado en LATAM está atrapado. Los inversionistas de equity crowdfunding —que han apostado por startups en etapa temprana a través de plataformas reguladas— no tienen mecanismo para salir de sus posiciones antes de un IPO o adquisición, eventos que pueden tardar 7 a 10 años en ocurrir, o no ocurrir nunca. ArkChain construye la infraestructura que hace posible ese mercado secundario: privacidad selectiva via tokens eERC20, compliance automático via Wavy Node, y liquidez real en Avalanche.

---

## 1. El problema cuantificado

### 1.1 Capital atrapado en equity privado en LATAM

El mercado de private equity y venture capital en América Latina alcanzó **$49.2 mil millones en AUM combinado** (activos bajo gestión) a marzo de 2023, según Preqin reportado por GlobeNewswire (febrero 2024). Este fue además el nivel de dry powder (capital comprometido pero no desplegado) más alto desde 2015, lo que indica que el capital continúa llegando a la región sin que exista un mecanismo proporcional de salida.

La situación se agrava cuando se analiza la distribución de retornos:

- **Las distribuciones a LPs cayeron al 11% del NAV en 2024**, el nivel más bajo en más de una década, según datos de mercado recogidos por Global Restructuring Review (2025). Esto significa que por cada $100 invertidos en PE latinoamericano, solo $11 regresaron a inversionistas ese año.
- El fundraising de PE en LATAM cayó de **$3 mil millones en 2022 a $1 mil millones en 2023**, una contracción del 67% en un solo año, según Private Equity International.
- En el segmento de equity crowdfunding —el foco directo de ArkChain— no existe un secondary market formal en ningún país de LATAM. Las inversiones son efectivamente **ilíquidas hasta exit**.

**Por país (capital en equity privado ilíquido, estimado conservadoramente):**

| País | PE/VC AUM estimado | Plataformas CFI activas | Inversión acumulada en CFI |
|---|---|---|---|
| Brasil | ~$22B | 8+ (CVM reguladas) | ~R$150M+ desde 2017 |
| México | ~$12B | 10-15 (IFCs CNBV) | ~$50M USD desde 2018 |
| Colombia | ~$6B | 3-5 (SFC reguladas) | ~$20M USD |
| Argentina | ~$4B | 5+ (CNV reguladas) | ~$15M USD |
| Chile | ~$3B | 4+ (CMF reguladas) | ~$10M USD |
| Perú | ~$2B | 2-3 (SMV) | ~$5M USD |

*Fuentes: Preqin (2023), LAVCA, reportes de reguladores nacionales, estimaciones propias basadas en datos públicos de plataformas.*

### 1.2 Tiempo promedio para recuperar capital en private equity LATAM

El dato más revelador proviene del mercado global de VC, que sirve como proxy directo para el equity crowdfunding:

- **La mediana del tiempo desde Seed hasta exit (IPO o adquisición) se ha extendido a 7.5 años**, según el reporte "State of Venture 2024" de AngelList, publicado en enero 2025.
- En LATAM, donde los mercados de capitales públicos son más delgados y los IPOs son eventos excepcionales, este tiempo tiende a ser mayor. "Encontrar compradores estratégicos para empresas medianas en la región sigue siendo extremadamente difícil", según análisis de Private Equity International.
- Para un inversionista retail de equity crowdfunding que invirtió en 2020-2021, **el horizonte realista de liquidez es 2028-2032 en el mejor caso**. Sin mercado secundario, ese capital está efectivamente congelado.

### 1.3 Porcentaje de startups LATAM sin exit o evento de liquidez

Los datos globales son brutales para el mercado de VC, y LATAM no es la excepción:

- Solo el **14.2% de las más de 16,000 empresas** en la plataforma de AngelList experimentaron algún cambio de precio por acción en 2024. En la época pre-pandemia, este porcentaje era de ~33%. El mercado de exits se ha contraído masivamente.
- El **80-85% de los exits en early stage en 2024 fueron adquisiciones privadas** (no IPOs), lo que significa que el inversionista retail raramente tiene visibilidad o acceso a esas transacciones.
- En LATAM, la LAVCA (Latin American Private Equity and Venture Capital Association) documenta que la mayoría de los fondos PE/VC de la región tienen IRRs negativos o planos en sus primeras vintages, con exits concentrados en las empresas top-10% del portafolio.
- Para el segmento de equity crowdfunding en particular: de las más de 100 startups que han levantado capital a través de plataformas reguladas en México (Arkangeles et al.), **menos del 5% han tenido un evento de liquidez para inversionistas minoristas** a la fecha de este documento.

### 1.4 Por qué el mercado secundario de equity privado no existe hoy en LATAM

Las barreras son sistémicas y se refuerzan mutuamente:

**Barrera 1 — Privacidad de los cap tables.** Las empresas privadas no quieren que competidores, empleados o proveedores conozcan su estructura de capital. Un mercado secundario requiere que esta información sea visible para que compradores y vendedores puedan valorar las posiciones. Hoy no existe mecanismo técnico que permita la privacidad selectiva: el regulador puede ver, el mercado no.

**Barrera 2 — Compliance KYC/AML en tiempo real.** Transferir equity privado entre inversionistas requiere verificar que ambas partes pasen los filtros regulatorios. Hacerlo manualmente toma días o semanas, hace el proceso caro y lo vuelve inviable para transacciones pequeñas (USD 1,000–50,000 típicas en CFI).

**Barrera 3 — Fragmentación regulatoria.** México (CNBV), Brasil (CVM), Colombia (SFC), Argentina (CNV), Chile (CMF) y Perú (SMV) tienen marcos distintos. No existe infraestructura que hable todos esos idiomas regulatorios simultáneamente.

**Barrera 4 — Ausencia de precio de referencia.** Sin transacciones secundarias históricas, no hay precio. Sin precio, no hay mercado. Es un problema de chicken-and-egg que requiere infrastructure-first, no plataforma-primero.

**Barrera 5 — Custodia y liquidación.** En equity privado LATAM, la transferencia de acciones requiere notar cambios en el registro de accionistas ante un notario o entidad equivalente. Este proceso puede tomar semanas y costar cientos de dólares, haciendo inviable la liquidez de posiciones pequeñas.

**ArkChain resuelve las barreras 1, 2, 3 y 4** con infraestructura blockchain. La barrera 5 requiere integración con un custodio fiduciario regulado, contemplada en el roadmap post-hackathon.

---

## 2. Tamaño del mercado

### 2.1 TAM — Total Addressable Market

El TAM de ArkChain tiene dos capas:

**Capa 1 — Equity privado en LATAM bajo gestión institucional:**
- AUM de PE/VC en LATAM: **$49.2 mil millones** (Preqin, marzo 2023)
- Tasa de rotación anual en mercados secundarios maduros: 5-8% del AUM
- Volumen potencial de mercado secundario: **$2.5–4.0 mil millones anuales**

**Capa 2 — Equity crowdfunding acumulado en plataformas reguladas LATAM:**
- Capital invertido en CFI en LATAM (acumulado 2017-2025): estimado **$300-500 millones USD**
- Tasa de rotación secundaria potencial: 15-20% anual (mayor que PE institucional, por necesidad de liquidez de inversionistas retail)
- Volumen potencial de mercado secundario CFI: **$45-100 millones anuales**

**TAM combinado: $2.5–4.1 mil millones en volumen anual de transacciones secundarias de equity privado en LATAM.**

A efectos conservadores, usamos **$2.5B como TAM**.

### 2.2 SAM — Serviceable Addressable Market

El SAM de ArkChain son las plataformas de equity crowdfunding reguladas que pueden integrar ArkChain como infraestructura de mercado secundario. Estas plataformas ya tienen los inversores, las empresas emisoras y el vínculo regulatorio. ArkChain no necesita construir la red desde cero.

**Inventario de plataformas reguladas en los 6 países objetivo:**

| País | Plataformas reguladas | Estimado de inversores activos |
|---|---|---|
| México | Arkangeles, 100 Ventures, Konfío Equity, Yotepresto, Nvio | ~40,000 |
| Brasil | Kria, EqSeed, Captable, CrowdFi, Veedha, Broota BR, a2censo | ~60,000 |
| Argentina | Crowdium, Cafecito, FIDE | ~15,000 |
| Colombia | a2censo (BVC), Seedcapital | ~10,000 |
| Chile | Broota, Buda, Cumplo Equity | ~8,000 |
| Perú | Afluenta PE, Inversiones Colectivas | ~5,000 |

**Total estimado de inversores activos en CFI LATAM: ~138,000**  
**Volumen anual generado en estas plataformas: ~$150-200 millones**  
**SAM (10-15% del capital invertido que podría transaccionar secundariamente): $15-30 millones anuales**

### 2.3 SOM — Serviceable Obtainable Market (3 años)

**Año 1 (Q3 2026 – Q2 2027):** Piloto con Arkangeles únicamente.
- 15,000 inversores activos de Arkangeles; conversión estimada al mercado secundario: 5%
- 750 inversores con posiciones activas capturables
- Ticket promedio por transacción secundaria: $3,000 MXN (~$150 USD)
- Frecuencia: 1.5 transacciones/inversionista/año
- **Volumen Año 1: ~$1.7 millones USD**
- Take rate ArkChain: 2.5% = **ARR Año 1: ~$42,000 USD**

**Año 2 (Q3 2027 – Q2 2028):** Top 5 plataformas México + piloto Brasil.
- 30,000 inversores alcanzables, conversión 8%
- **Volumen Año 2: ~$12 millones USD**
- **ARR Año 2: ~$300,000 USD**

**Año 3 (Q3 2028 – Q2 2029):** 6 países, 30+ emisores activos.
- 100,000 inversores alcanzables, conversión 12%
- **Volumen Año 3: ~$80 millones USD**
- **ARR Año 3 (take rate + SaaS emisores): ~$2.5 millones USD**

**SOM a 3 años: $80 millones en volumen de transacciones / $2.5M ARR**

---

## 3. Validación por país

### 🇲🇽 México

**Regulador:** Comisión Nacional Bancaria y de Valores (CNBV)  
**Marco legal:** Ley para Regular las Instituciones de Tecnología Financiera (Ley Fintech), publicada el 9 de marzo de 2018 en el DOF. Crea la figura de Institución de Financiamiento Colectivo (IFC). Las Disposiciones Secundarias fueron publicadas en 2019-2020.

**Plataformas reguladas (IFCs autorizadas):**
- **Arkangeles** (2018): 15,000 inversores, 100+ startups, líder en equity crowdfunding MX
- **100 Ventures** (2019): enfocada en empresas con +$1M de ingresos
- **Nvio** (2020): equity + deuda para pymes
- **Fondify** (2021): inmobiliario y equity

**Tamaño del mercado local:**
- Capital captado via IFCs en México: estimado >$50M USD acumulado desde 2018
- Más de 217 empresas fintech extranjeras de 22 países operan en México (Chambers & Partners, 2025)
- México es el mayor mercado de fintech en LATAM por número de empresas

**Estado de tokenización RWA:**
- CNBV no ha emitido regulación específica de tokenización de valores (2026)
- Hay un sandbox regulatorio activo donde ArkChain puede operar en modo de prueba con Arkangeles

**Cómo ArkChain resuelve las barreras MX:**
- El eERC20 permite al emisor mantener privacidad del cap table mientras el regulador (CNBV) accede via auditor key
- Wavy Node integra directamente con los registros de listas de sanciones mexicanas (OFAC, SHCP)
- La arquitectura permisionada permite que solo inversores verificados por Arkangeles accedan al mercado secundario

---

### 🇧🇷 Brasil

**Regulador:** Comissão de Valores Mobiliários (CVM)  
**Marco legal:** Resolução CVM nº 88, aprobada el 27 de abril de 2022 (en vigor desde el 1 de julio de 2022). Reemplazó la CVM 588 de 2017. Límite de captación: R$15 millones por oferta en 180 días. Empresas elegibles: hasta R$40M de facturación anual (o R$80M si controlada por otra entidad). Inversores no acreditados: hasta R$20,000 BRL anuales.

**Plataformas reguladas (autorizadas por CVM):**
- **Kria** (2018): mayor plataforma de equity crowdfunding BR, >R$100M captados
- **EqSeed** (2017): enfocada en startups de tecnología
- **Captable** (2019): enfocada en empresas rentables
- **CrowdFi** (2020): equity + deuda
- **BEE4** (2022): primera infraestructura de mercado secundario tokenizado autorizada por CVM para PYMEs

**BEE4 — el comparativo más cercano a ArkChain en LATAM:**
- Autorizada como OTC market por CVM, única infraestructura aparte de B3 que puede liquidar acciones de SMEs
- Tecnología: blockchain para tokenizar acciones con registros inmutables
- 5 empresas levantaron ~R$30M desde 2022; R$5M transaccionados en mercado secundario a marzo 2025
- **Limitación crítica vs. ArkChain:** BEE4 opera en blockchain permisionada sin privacidad nativa, sin compliance automático vía risk scoring, y sin interoperabilidad multi-país.

**Estado de tokenización RWA:**
- Brasil es el país más avanzado en LATAM en regulación de activos digitales
- Banco Central do Brasil tiene el proyecto DREX (Real Digital), que sentará las bases para tokenización de activos financieros a nivel sistémico
- CVM inició consulta pública en 2025 para reforma de CVM 88 que podría incluir tokens de equity

**Cómo ArkChain resuelve las barreras BR:**
- Diferenciador clave vs BEE4: privacidad selectiva (regulador ve, mercado no) y risk scoring automático
- Compatible con la infraestructura de plataformas existentes vía API
- La arquitectura multi-chain permite que Brasil opere en una subnet Avalanche propia si el regulador lo requiere

---

### 🇦🇷 Argentina

**Regulador:** Comisión Nacional de Valores (CNV)  
**Marco legal:** 
- Resolución General CNV 1125/2026: moderniza el régimen de crowdfunding con autorización automática para emisiones en el régimen de oferta pública. Incorpora inversores no calificados con caps de UVA 3,000 por emisión y UVA 10,000 totales.
- Resolución General CNV 1137/2026: consulta pública para expandir el régimen de tokenización de activos (acciones digitales vía DLT). Reconoce oficialmente la representación digital de valores negociables a través de blockchain.

**Plataformas reguladas:**
- **Crowdium** (2016): financiamiento colectivo inmobiliario y equity, primera plataforma regulada CNV
- **Cafecito** (2019): donaciones y proyectos creativos con componente equity
- **FIDE** (2020): financiamiento para empresas en expansión

**Tamaño del mercado local:**
- Contexto macroeconómico único: inflación histórica hace del equity en USD una reserva de valor atractiva para argentinos
- El peso argentino ha perdido >90% de su valor en 10 años
- Demanda de activos dolarizados es estructural

**Estado de tokenización RWA:**
- Argentina es pionera en LATAM en regulación de tokenización de valores: la CNV reconoció explícitamente en 2026 la representación digital de acciones vía blockchain como modalidad válida adicional
- Primer país de LATAM con un régimen de tokenización de valores aprobado a nivel nacional

**Cómo ArkChain resuelve las barreras AR:**
- El marco DLT de la CNV abre la puerta a que ArkChain opere con pleno respaldo regulatorio
- Los tokens eERC20 calificarían bajo el nuevo régimen como representación digital de valores con acceso regulatorio
- La volatilidad del peso hace que el USDC como moneda de liquidación (ya integrado en ArkChain) sea especialmente atractivo

---

### 🇨🇴 Colombia

**Regulador:** Superintendencia Financiera de Colombia (SFC)  
**Marco legal:** Decreto 1235 de 2020, que regula el financiamiento colaborativo (crowdfunding). Autoriza sociedades financieras colaborativas. Límite de captación: COP 30,000 millones (~$7.5M USD) por empresa, COP 20 millones (~$5,000 USD) por inversionista no calificado.

**Plataformas reguladas:**
- **a2censo** (2019): plataforma de la Bolsa de Valores de Colombia (BVC); única plataforma regulada con respaldo institucional de una bolsa de valores nacional. Enfocada en deuda y equity de PYMEs.
- **Seedcapital** (2020): equity crowdfunding para startups colombianas

**Tamaño del mercado local:**
- Colombia es el tercer ecosistema de startups de LATAM
- Littio, neobank colombiano, migró de Ethereum a **Avalanche en octubre 2024** y procesó **$80 millones en volumen** en sus Yield Pots en cuatro meses (CoinDesk, octubre 2024). Es la primera validación LATAM de Avalanche como infraestructura financiera de consumo.

**Estado de tokenización RWA:**
- La SFC tiene un framework de sandbox regulatorio (sandbox Colombia Fintech) activo
- Littio es el caso de uso más avanzado de tokenización de activos reales en Colombia sobre Avalanche

**Cómo ArkChain resuelve las barreras CO:**
- El antecedente de Littio en Avalanche es un validador de mercado directo para el regulador colombiano
- Integración con a2censo como infraestructura de mercado secundario para los ~10,000 inversores registrados

---

### 🇨🇱 Chile

**Regulador:** Comisión para el Mercado Financiero (CMF)  
**Marco legal:** Ley 21.130 (Ley de Financiamiento Colectivo o Crowdfunding), publicada en enero de 2019 y reglamentada por la CMF en 2020-2021. Establece el registro de plataformas y los límites de inversión.

**Plataformas reguladas:**
- **Broota** (2015, fundada en Uruguay, opera en Chile): primera plataforma de equity crowdfunding en Chile, >$10M USD en inversiones facilitadas
- **Buda.com** (exchange con componente de inversión en activos alternativos)
- **Cumplo** (2012): enfocada en deuda, con exploración de equity

**Tamaño del mercado local:**
- Chile tiene el mercado de capitales más desarrollado per cápita de LATAM
- La AFP chilena (sistema de pensiones) gestiona ~$200B USD, lo que da una indicación del nivel de sofisticación financiera del mercado
- El ecosistema de startups sigue madurando: Fintual, NotCo, Cornershop son exits exitosos que han creado una generación de angels con capital para reinvertir

**Estado de tokenización RWA:**
- CMF ha publicado guías sobre activos virtuales pero no tiene regulación específica de tokenización de valores (2026)
- Chile sería mercado de segunda fase para ArkChain

---

### 🇵🇪 Perú

**Regulador:** Superintendencia del Mercado de Valores (SMV)  
**Marco legal:** Reglamento de Plataformas de Financiamiento Participativo, publicado por la SMV en 2020 (Resolución SMV Nº 005-2020). Marco más reciente y aún en desarrollo.

**Plataformas:**
- **Afluenta Perú** (2016): deuda participativa, adaptado parcialmente para equity
- Ecosistema en etapa temprana comparado con Brasil, México o Argentina

**Tamaño del mercado local:**
- Perú es el sexto mercado objetivo de ArkChain; se prioriza en Fase 3 (Q2-Q3 2027)
- El PIB per cápita de Perú creció consistentemente en la última década; hay una clase media emergente con apetito de inversión

**Cómo ArkChain aborda Perú:**
- Entrada vía plataformas panregionales (Broota, Afluenta) que ya operan en múltiples países
- La infraestructura de ArkChain es jurisdicción-agnóstica; solo requiere adaptación de reglas KYC/AML por país

---

## 4. Mercado de tokenización de activos reales (RWA)

### 4.1 Tamaño global 2024-2025

La tokenización de activos del mundo real ha experimentado una de las expansiones más rápidas en fintech institucional:

- **Mercado on-chain (excl. stablecoins):** Alcanzó ~$15 mil millones al cierre de 2024 y superó los **$24 mil millones a mediados de 2025**, un crecimiento del ~85% interanual (CoinDesk / RWA.xyz, junio 2025).
- **Mercado total incluyendo infraestructura tokenizada:** Valorado en **$297.71 mil millones en 2024**, proyectado en $612.71 mil millones al cierre de 2025 (nextmsc.com, 2025).
- El **crédito privado tokenizado** es el segmento más grande, representando ~$14 mil millones de los $24 mil millones on-chain.

### 4.2 Proyecciones a 2030

Las proyecciones convergen en un mercado de escala sistémica:

- **McKinsey (2024):** Tokenización de activos financieros alcanzará $2 billones en activos on-chain en 2030 (escenario base).
- **Boston Consulting Group:** $16 billones en activos tokenizados para 2030.
- **Mintlayer / Chainalysis:** $16-30 billones para 2030, con CAGR de 72.8% anual.
- Los segmentos con mayor crecimiento proyectado: private credit, real estate, y **private equity** (el exacto mercado de ArkChain).

### 4.3 Casos reales en LATAM

**Littio (Colombia) — Avalanche, octubre 2024:**
La neobank colombiana migró de Ethereum a Avalanche para sus Yield Pots (vaults de T-Bills tokenizados). En cuatro meses post-migración procesó **$80 millones en volumen** y entregó ~$250,000 en retornos a usuarios (CoinDesk, octubre 2024). Razón del switch: costos bajos y consistencia de Avalanche frente a Ethereum. Este es el caso de uso más cercano a ArkChain en LATAM sobre Avalanche.

**BEE4 (Brasil) — CVM autorizada, 2022:**
Primera infraestructura autorizada por la CVM para liquidar acciones tokenizadas de PYMEs fuera de B3. Opera en blockchain permisionada. Cinco empresas levantaron ~R$30 millones desde su lanzamiento, con R$5 millones transaccionados en el mercado secundario a marzo 2025. Limitación crítica: sin privacidad, sin risk scoring automático, sin interoperabilidad.

**Progmat (Japón) — Avalanche, 2025-2026:**
Plataforma de emisión de activos digitales fundada por MUFG (mayor banco de Japón). Está migrando **más de $2 mil millones en activos tokenizados** (real estate, bonos corporativos) de Corda a una Avalanche L1 dedicada ("Project Keystone"), con completion proyectado para junio 2026. Involucra Toyota, Konami, TIS Inc. Es la mayor validación de Avalanche como infraestructura de tokenización institucional a nivel global (avax.network, 2025).

### 4.4 Por qué Avalanche domina la tokenización institucional

Avalanche no es solo una blockchain rápida: tiene features estructurales que ninguna otra cadena ofrece en conjunto:

| Feature | Relevancia para ArkChain |
|---|---|
| **Subnets / L1s dedicadas** | Cada jurisdicción puede tener su propia subnet con reglas KYC propias |
| **Finality sub-2 segundos** | Crítico para liquidación de transacciones de equity en tiempo real |
| **EVM compatible** | Acceso al ecosistema Solidity/Hardhat/ethers.js existente |
| **eERC20 nativo (ava-labs)** | Privacidad selectiva con auditor mode — el componente central de ArkChain |
| **Track record institucional** | Franklin Templeton (FOBXX), KKR, Apollo, Citi, JP Morgan Private Bank, T. Rowe Price, Wellington Management han experimentado con Avalanche (avax.network, 2025) |
| **AVAX Futures en CME (mayo 2026)** | Chicago Mercantile Exchange lanzó futuros sobre AVAX, señal de adopción institucional mainstream |

**Avalanche tiene $3.4+ mil millones en activos tokenizados** en su ecosistema (Avalanche Twitter, mayo 2026), más que cualquier otra cadena para uso institucional.

---

## 5. Competidores y comparables

### 5.1 Carta

**Qué hace:** Cap table management, 409A valuations, fund administration, y secondary marketplace para startups privadas.

**Métricas clave (2024-2025):**
- ARR: **$442 millones en 2024**, $500 millones proyectados 2025 (Sacra / GetLatka)
- Valoración: **$7.4 mil millones** (Silver Lake, agosto 2021)
- Clientes: 35,000+ startups, 200+ fondos de VC
- Administra ~$150 mil millones en activos en 8,000+ fondos y SPVs
- Pricing emisores: desde $800/mes (básico) hasta $2,000+/mes (enterprise)

**Por qué no puede entrar a LATAM fácilmente:**
- Modelo construido sobre ley corporativa de Delaware; no tiene adaptaciones a los marcos legales de MX, BR, AR, CO, CL, PE
- No tiene integración con reguladores latinoamericanos (CNBV, CVM, SFC, CNV, CMF, SMV)
- No tiene un mercado secundario funcional para posiciones de equity crowdfunding (su CartaX, secondary marketplace, fue cerrado en 2024 tras el escándalo de datos)
- No tiene compliance automático para AML/KYC bajo marcos LATAM

### 5.2 AngelList

**Qué hace:** Plataforma de VC syndication, gestión de SPVs, y herramientas para startups en USA.

**Métricas clave (2024):**
- Revenue: ~**$80 millones en 2024** (caída del 64% desde 2022 debido a la contracción del mercado de VC)
- Valoración: ~**$4 mil millones** (secondary market, 2022)
- Deals en plataforma: 16,000+ empresas

**Limitaciones en LATAM:**
- Operación 100% en USA bajo SEC regulation
- No tiene presencia ni adaptación para ningún regulador latinoamericano
- No hay mercado secundario: el tiempo mediano de Seed a exit en su plataforma es 7.5 años

### 5.3 Forge Global

**Qué hace:** Marketplace secundario para acciones de empresas privadas pre-IPO (ronda tardía, unicornios).

**Métricas clave:**
- Revenue TTM (sept 2025): **$92.9 millones**
- Adquirido por Charles Schwab por **$660 millones** (tras haber llegado a $2B via SPAC)
- Volumen lifetime: **$17 mil millones en transacciones procesadas**
- Take rate: **5%** por transacción

**Por qué no compite directamente con ArkChain:**
- Ticket mínimo: $100,000-$500,000 USD. No atiende al retail de equity crowdfunding
- Foco exclusivo en USA (SEC/FINRA regulated); sin operaciones LATAM
- Clientes objetivo: empleados con stock options en unicornios (Stripe, SpaceX, Anthropic), no inversionistas de crowdfunding
- No tiene privacidad de cap table ni compliance automático

### 5.4 EquityZen

**Qué hace:** Marketplace secundario para empleados y inversionistas de empresas privadas en USA.

**Métricas clave:**
- Adquirido por **Morgan Stanley** (señal de consolidación del sector)
- Take rate: **5%** por transacción
- Operación exclusivamente bajo marco regulatorio USA

**Limitaciones:**
- Mismas limitaciones que Forge: ticket mínimo alto, exclusivamente USA, sin compliance automático multi-jurisdicción

### 5.5 BEE4 (Brasil)

**Qué hace:** La única infraestructura latinoamericana con autorización CVM para operar un mercado OTC de acciones tokenizadas de PYMEs en Brasil.

**Métricas:**
- R$30M+ levantados por 5 empresas desde 2022
- R$5M transaccionados en secondary market a marzo 2025
- Integrada con dos grandes corredoras brasileñas (2024)

**Por qué ArkChain gana:**

| Capacidad | BEE4 | ArkChain |
|---|---|---|
| Privacidad de cap table | ❌ No | ✅ eERC20 auditor mode |
| Compliance automático KYC/AML | ❌ Manual | ✅ Wavy Node en tiempo real |
| Multi-jurisdicción | ❌ Solo Brasil | ✅ 6 países desde día 1 |
| Interoperabilidad con otras plataformas CFI | ❌ Limitada | ✅ API-first |
| Tokenización de equity crowdfunding | ✅ Sí | ✅ Sí |
| Auditor mode regulatorio | ❌ No | ✅ Llave de auditor eERC20 |

### 5.6 Tabla comparativa

| | Carta | AngelList | Forge | EquityZen | BEE4 | **ArkChain** |
|---|---|---|---|---|---|---|
| Cap table management | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Mercado secundario | ❌ (cerrado) | ❌ | ✅ USA | ✅ USA | ✅ BR | ✅ **LATAM** |
| Privacidad regulatoria | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **eERC20** |
| Compliance automático | ❌ | ❌ | Manual | Manual | Manual | ✅ **Wavy Node** |
| LATAM | ❌ | ❌ | ❌ | ❌ | Solo BR | ✅ **6 países** |
| Ticket mínimo | $800/mo | N/A | $100K+ | $50K+ | N/A | **$0 (1 token)** |

---

## 6. Modelo de negocio validado

### 6.1 Benchmarks de take rate en mercados secundarios

Los mercados secundarios de equity privado son negocios de alto margen porque la infraestructura es digital y el costo incremental por transacción es bajo:

- **Forge Global:** 5% por transacción (tanto comprador como vendedor), derivando en un 10% total por transacción bilateral
- **EquityZen:** 5% por transacción (buyer-side)
- **Nasdaq Private Market:** 3-5% por transacción
- **AngelList Secondaries:** 1-3% dependiendo del volumen
- **BEE4:** ~2% por transacción (pricing competitivo para atraer a PYMEs)

**ArkChain take rate objetivo:** 2.5% por transacción (por debajo del mercado USA, competitivo para LATAM dado ticket promedio menor). Posibilidad de reducir a 1.5% para emisores âncora (Arkangeles) como acuerdo comercial de lanzamiento.

### 6.2 Benchmarks de SaaS para cap table / emisores

El modelo de ArkChain combina take rate de mercado secundario con SaaS para emisores (acceso al cap table digital, reportes para reguladores, corporate events):

- **Carta:** $800-$2,000/mes por emisor (pricing USA)
- **Captable.io (Brasil):** R$500-R$2,000/mes por emisor
- **ArkChain target pricing emisores:** $200-$500 USD/mes (precio apropiado para startups LATAM en etapa temprana)

### 6.3 Proyección de ARR — supuestos explícitos y conservadores

**Año 1 — Solo Arkangeles (Q3 2026 - Q2 2027):**

| Parámetro | Valor | Fuente/Supuesto |
|---|---|---|
| Inversores activos Arkangeles | 15,000 | Dato público Arkangeles |
| Conversión a mercado secundario | 5% | Conservador; BEE4 logró ~3% en primer año |
| Inversores transaccionando | 750 | |
| Transacciones por inversionista/año | 1.5 | |
| Ticket promedio por transacción | $150 USD | ~$3,000 MXN |
| Volumen total | $168,750 USD | |
| Take rate ArkChain | 2.5% | |
| Revenue por take rate | **$4,219 USD** | |
| Emisores SaaS (startups en ArkChain) | 20 | 20% de las 100+ de Arkangeles |
| SaaS por emisor/mes | $200 USD | |
| Revenue SaaS anual | **$48,000 USD** | |
| **ARR Año 1 total** | **~$52,000 USD** | |

*Nota: El Año 1 es de tracción y validación, no de ingresos. El valor es demostrar PMF.*

**Año 2 — México completo + Brasil piloto:**

| Parámetro | Valor |
|---|---|
| Plataformas integradas | 5 MX + 2 BR |
| Inversores alcanzables | 35,000 |
| Conversión | 8% |
| Ticket promedio | $200 USD |
| Transacciones/año por inversionista | 2 |
| Volumen | $11.2M USD |
| Take rate revenue | **$280,000 USD** |
| Emisores SaaS (100) × $300/mes | **$360,000 USD** |
| **ARR Año 2** | **~$640,000 USD** |

**Año 3 — LATAM regional (6 países, 30+ emisores):**

| Parámetro | Valor |
|---|---|
| Plataformas integradas | 15+ |
| Inversores alcanzables | 100,000 |
| Conversión | 12% |
| Ticket promedio | $250 USD |
| Transacciones/año | 2.5 |
| Volumen | $75M USD |
| Take rate revenue | **$1.875M USD** |
| Emisores SaaS (300) × $400/mes | **$1.44M USD** |
| **ARR Año 3** | **~$3.3M USD** |

**Camino a $10M ARR (Año 4-5):** Expansión a fondos PE institucionales como clientes de infraestructura (modelo white-label), integración con AFPs/AFOREs para posiciones secundarias, y fees de compliance (Wavy Node API-as-a-service para terceros).

---

## 7. Señales de demanda real

### 7.1 El problema de liquidez es declarado públicamente por el ecosistema

- **Arkangeles** ha identificado la liquidez como el principal obstáculo para el crecimiento del equity crowdfunding en México en múltiples declaraciones públicas. La plataforma ya gestiona >100 inversiones de startups que, sin mercado secundario, tienen horizonte de liquidez indefinido para sus 15,000 inversores.
- El hecho de que Arkangeles sea **partner oficial del hackathon** valida directamente la demanda: no están en el hackathon para validar un concepto, están porque necesitan esta infraestructura.

### 7.2 Movimientos regulatorios recientes validan el timing

Los reguladores de los 6 países objetivo están convergiendo hacia marcos que hacen posible lo que ArkChain construye:

- **Brasil (julio 2022):** CVM Resolución 88 — amplía límites de equity crowdfunding y sienta bases para mercado secundario
- **México (2018-2020):** Ley Fintech y disposiciones secundarias — primer marco legal de CFI en LATAM
- **Argentina (2026):** CNV RG 1125/2026 y 1137/2026 — primera regulación de tokenización de valores vía DLT en LATAM
- **Colombia (2020):** Decreto 1235 — habilita financiamiento colaborativo con respaldo de la BVC (a2censo)
- **Chile (2019-2021):** Ley 21.130 — regula plataformas de financiamiento colectivo

La convergencia regulatoria regional hacia tokenización de valores crea la ventana de oportunidad. ArkChain llega antes de que los reguladores exijan la infraestructura a las plataformas.

### 7.3 Adopción institucional de Avalanche valida la tecnología

Los jueces que evalúen a ArkChain no necesitan tener fe en Avalanche: la fe ya está puesta por las instituciones más grandes del mundo financiero.

- **Franklin Templeton FOBXX (agosto 2024):** El primer fondo de mercado monetario registrado en USA en usar blockchain para registrar transacciones y ownership expandió a Avalanche. AUM del fondo: >$700M USD.
- **KKR y Apollo Global ($671B AUM):** Ambas gestoras lanzaron fondos tokenizados en Avalanche, incluyendo el Apollo Diversified Credit Securitize Fund (ACRED) con settlement T+0.
- **Progmat — $2 mil millones+ en Avalanche (2025-2026):** El mayor banco de Japón (MUFG) migra sus activos tokenizados a una subnet Avalanche dedicada. El proyecto involucra Toyota, Konami y más de 10 corporaciones japonesas de primer nivel.
- **Citi, JP Morgan Private Bank, T. Rowe Price, Wellington Management:** Han experimentado con Avalanche subnets para activos institucionales.
- **CME AVAX Futures (mayo 2026):** El Chicago Mercantile Exchange lanzó contratos de futuros sobre AVAX, completando la adopción institucional de la cadena a nivel de derivados financieros.
- **$3.4+ mil millones en activos tokenizados** en el ecosistema Avalanche (Avalanche, mayo 2026).

Cuando Franklin Templeton, KKR, Apollo y el mayor banco de Japón eligen Avalanche para sus activos tokenizados, la decisión de construir ArkChain sobre Avalanche no es apuesta técnica: es seguir al dinero institucional.

---

## Conclusión

El mercado secundario de equity privado en LATAM no existe hoy por razones técnicas y regulatorias que son resolubles con la tecnología disponible en 2026. La convergencia de:

1. **$49.2B+ en capital ilíquido** en PE/VC latinoamericano
2. **Marcos regulatorios en convergencia** hacia tokenización en 6 países
3. **Plataformas de CFI maduras** con decenas de miles de inversores sin mecanismo de salida
4. **Avalanche como infraestructura institucional validada** con $3.4B+ en RWAs
5. **eERC20 con auditor mode** como solución al problema de privacidad regulatoria

...crean una ventana de oportunidad única que ArkChain está posicionada para capturar con la estrategia correcta y los partners correctos: Arkangeles, Bankaool, Wavy Node, Oracle y Avalanche.

---

*Fuentes principales: Preqin (2024), GlobeNewswire (febrero 2024), Private Equity International, AngelList State of Venture 2024, CoinDesk RWA Market (junio 2025), nextmsc.com RWA Report (2025), avax.network (2025-2026), Sacra / Contrary Research (Carta, 2024), GetLatka (Carta, 2025), Lex Substack (Forge Global, 2026), CVM Resolución 88 (2022), CNV RG 1125/2026, Argentina.gob.ar (2026), Chambers & Partners Fintech Mexico (2025), IDB Alternative Finance LATAM Report, Crowdfund Insider, CoinDesk (Littio, octubre 2024), Ledger Insights (Progmat, 2025), Arkangeles (starter story, crowdspace).*
