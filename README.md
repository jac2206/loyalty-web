# Loyalty Web

Frontend web para una plataforma de lealtad. La aplicacion permite autenticar usuarios, consultar perfil, consultar saldo de puntos, acumular puntos, redimir puntos y visualizar el historial de transacciones.

## 1. Introduccion

Loyalty Web es la interfaz web de un sistema de lealtad orientado a usuarios, cuentas de puntos y transacciones de acumulacion/redencion.

El proyecto resuelve la necesidad de ofrecer una experiencia web clara para operar sobre una API REST de lealtad: iniciar sesion, registrar usuarios, consultar datos de cuenta y ejecutar movimientos de puntos.

Tecnologias principales:

- Next.js con App Router
- TypeScript
- Axios
- Tailwind CSS

## 2. Stack Tecnologico

- **Next.js (App Router):** routing por carpetas en `src/app`.
- **React:** componentes funcionales y hooks para estado local.
- **TypeScript:** tipado estricto para payloads, respuestas y contratos internos.
- **Axios:** cliente HTTP centralizado en `src/shared/services/api.ts`.
- **Tailwind CSS:** estilos utilitarios y sistema visual consistente.
- **ESLint:** validacion estatica del codigo.

## 3. Arquitectura

El proyecto sigue una arquitectura basada en features. Cada dominio funcional vive en su propia carpeta dentro de `src/features`.

Separacion de responsabilidades:

- **UI:** componentes en `components`.
- **Logica:** hooks en `hooks`.
- **API:** servicios HTTP en `services`.
- **Contratos:** tipos TypeScript en `types`.

Flujo obligatorio:

```text
UI -> Hook -> Service -> API
```

Ejemplo:

```text
AccumulateForm -> useTransaction -> transactionService -> POST /transactions/accumulate
```

Los componentes no llaman APIs directamente. Los hooks coordinan estado, validacion y errores. Los services se encargan exclusivamente de HTTP.

## 4. Estructura del proyecto

```text
src/
  app/                     # Rutas de Next.js App Router
    <route>/               # Pagina o flujo, por ejemplo login, home, profile
      page.tsx             # Entrada visual de la ruta
    layout.tsx             # Layout raiz de la aplicacion
    page.tsx               # Ruta inicial
  features/                # Dominios funcionales del producto
    <feature>/             # Ejemplo: auth, account, transaction, user
      components/          # Componentes UI propios de la feature
      hooks/               # Logica de estado, validacion y coordinacion
      services/            # Consumo HTTP de endpoints del dominio
      types/               # Tipos y contratos TypeScript
  shared/                  # Codigo reutilizable entre features
    components/            # Componentes UI comunes
    services/              # Servicios compartidos, por ejemplo Axios y storage
  config/                  # Configuracion compartida si el proyecto la requiere
```

Carpetas principales:

- `src/app`: rutas de Next.js App Router.
- `src/features`: modulos de negocio organizados por dominio.
- `src/shared`: componentes, servicios y utilidades reutilizables.
- `src/config`: carpeta reservada para configuracion compartida cuando el proyecto la necesite.

Estructura interna de una feature:

- `components`: UI reutilizable del dominio.
- `hooks`: logica de estado, validacion y coordinacion.
- `services`: llamadas HTTP a la API.
- `types`: contratos TypeScript.

## 5. Carpeta `.agents` / `.ai`

El punto de entrada para agentes compatibles con Codex es `AGENTS.md` en la raiz. Este archivo enlaza las guias existentes de `.agents`; no se supone que estas se carguen automaticamente.

Proposito de SDD (Spec Driven Development):

- Definir reglas antes de implementar.
- Mantener consistencia entre features.
- Evitar decisiones improvisadas en arquitectura, UI y flujos.
- Facilitar prompts repetibles para agentes de codigo.

Archivos y carpetas:

```text
.agents/
  AGENTS.md               # Reglas operativas principales para agentes
  context.md              # Contexto general del producto
  specs/                  # Especificaciones funcionales por dominio
    auth.spec.md          # Endpoints y flujos de autenticacion
    account.spec.md       # Endpoints y flujos de cuenta/saldo
    transaction.spec.md   # Endpoints y flujos de transacciones
  architecture/           # Arquitectura frontend y patrones esperados
  instructions/           # Reglas concretas de implementacion
  skills/                 # Skills locales Loyalty Next.js, UI y Vitest
  desing/                 # Sistema visual definido para la aplicacion
```

Estas reglas ayudan a que los agentes generen codigo alineado con el proyecto: arquitectura por features, flujo UI -> Hook -> Service -> API, tipado estricto y componentes reutilizables.

## 6. Variables de entorno

El proyecto utiliza `.env.local` para variables locales de entorno.

Variable requerida:

```env
NEXT_PUBLIC_API_URL=https://xxxxxxx/loyalty/v1
```

`NEXT_PUBLIC_API_URL` se usa como base URL del cliente Axios configurado en:

```text
src/shared/services/api.ts
```

## 7. Instalacion

Requisitos:

- Node.js compatible con Next.js
- npm

Pasos:

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://localhost:3000
```

## 8. Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera el build de produccion.

```bash
npm run start
```

Sirve la aplicacion compilada.

```bash
npm run lint
```

Ejecuta ESLint.

```bash
npm test -- --run
```

Ejecuta las pruebas de Vitest una vez. `npm test` inicia Vitest en su modo predeterminado.

El despliegue de `master` mediante GitHub Actions y Vercel se describe en
[docs/vercel-ci-cd.md](docs/vercel-ci-cd.md), junto con los secrets necesarios y
el estado de las pruebas de CI.

## 9. Flujo de desarrollo

Para crear una nueva feature:

1. Revisar `AGENTS.md` y la spec correspondiente en `.agents/specs`, contrastandola con el codigo y el contrato vigente.
2. Crear carpeta en `src/features/<feature>`.
3. Definir tipos en `types`.
4. Crear service con llamadas HTTP.
5. Crear hook con estado, validacion y manejo de errores.
6. Crear componentes UI.
7. Integrar la ruta en `src/app`.
8. Ejecutar `npm run lint` y `tsc --noEmit`.

Ejemplo de estructura:

```text
src/features/auth/
  components/LoginForm.tsx
  hooks/useLogin.ts
  services/authService.ts
  types/auth.types.ts
```

Uso con prompts y agentes:

- Incluir el nombre de la feature.
- Incluir endpoint, body y respuesta esperada.
- Recordar el flujo UI -> Hook -> Service -> API.
- Pedir reutilizacion de componentes existentes en `src/shared`.

## 10. Buenas practicas

- No poner logica de negocio en componentes.
- No llamar APIs directamente desde componentes.
- Mantener servicios con responsabilidad unica.
- Usar TypeScript sin `any`.
- Reutilizar componentes de `src/shared/components`.
- Centralizar HTTP en `src/shared/services/api.ts`.
- Manejar estados `loading`, `error`, `empty` y `success` cuando aplique.
- Mantener formularios controlados desde hooks.

## 11. Integracion con backend

La aplicacion consume una API REST usando Axios.

Cliente base:

```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Autenticacion:

- El login recibe un JWT.
- El token se guarda en `sessionStorage`; si existe un token de una version anterior en `localStorage`, se migra y se elimina de alli.
- El interceptor de Axios agrega `Authorization: Bearer <token>`.

Endpoints principales:

### Auth

- `POST /users/login`
- `POST /users/register`
- `GET /users/me`

### Account

- `GET /accounts/balance/{documentType}/{documentNumber}`

### Transactions

- `POST /transactions/accumulate`
- `POST /transactions/redeem`
- `GET /transactions/{documentType}/{documentNumber}`

Los encabezados y permisos deben verificarse contra el servicio y el contrato vigente del backend; no se debe asumir que el cliente autoriza operaciones por si solo.

## 12. Testing

El proyecto tiene Vitest, React Testing Library y jsdom configurados. Las pruebas existentes se ubican junto al codigo y se ejecutan con `npm test -- --run`. MSW y Playwright son opciones futuras, no herramientas configuradas actualmente.

Casos sugeridos:

- Validacion de formularios.
- Manejo de errores HTTP.
- Render de estados loading/empty/success.
- Redireccion despues de login y registro.
- Persistencia y limpieza del token.

## 13. Recomendaciones futuras

- Evaluar cookies `httpOnly` para la sesion si el backend las soporta.
- Agregar manejo global de errores HTTP.
- Implementar proteccion de rutas autenticadas.
- Evaluar SSR o Server Components para pantallas que puedan beneficiarse de carga inicial del servidor.
- Agregar refresh token si el backend lo soporta.
- Centralizar mensajes de error y formato de fechas/numeros.
- Ampliar las pruebas automatizadas para los flujos que aun no estan cubiertos.

## Estado actual de features

- Login
- Registro
- Perfil de usuario
- Consulta de saldo
- Acumulacion de puntos
- Redencion de puntos
- Historial de transacciones
