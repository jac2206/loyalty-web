# AGENTS.md

Guía operativa para agentes de código en el frontend loyalty-web.

## 1. Propósito

Construir un frontend web en Next.js alineado con:

- app móvil existente (React Native)
- backend con arquitectura limpia

Objetivo:

- Consistencia técnica
- Código mantenible
- Reutilización de lógica existente
- Escalabilidad

---

## 2. Principios no negociables

- Separación de responsabilidades:
  - UI → Components
  - Lógica → Hooks
  - HTTP → Services

- No duplicar lógica del backend
- No lógica de negocio en componentes
- Tipado estricto (TypeScript)

---

## 3. Mapa del proyecto

- Routing: `src/app`
- Features: `src/features`
- Shared: `src/shared`
- API: `services/api.ts`

---

## 4. Flujo obligatorio

UI → Hook → Service → API

---

## 5. Definition of Done

Un cambio frontend está completo cuando:

1. Funciona funcionalmente
2. Respeta arquitectura
3. Tiene tipado correcto
4. Maneja errores
5. Es reutilizable

---

## 6. Anti-patrones

- Llamar API desde componentes ❌
- Hooks con lógica HTTP ❌
- Uso de `any` ❌
- Código duplicado del móvil ❌