# Arquitectura Frontend

Arquitectura basada en features.

## Capas

### app/
Routing con Next.js

### features/
Dominio:

- auth
- account
- transaction
- user

Cada feature contiene:
- components
- hooks
- services
- types

### shared/
Reutilizable:

- UI components
- axios
- utils

---

## Flujo

UI → Hook → Service → API

---

## Reglas

- No lógica en UI
- No HTTP en componentes
- Hooks = lógica
- Services = API