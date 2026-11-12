---
name: loyalty-nextjs
description: Implementa y revisa cambios de rutas, componentes y conexión HTTP de Loyalty Web con Next.js App Router. Úsala para cambios frontend específicos de este repositorio; no sustituye la guía de UI ni la de pruebas.
---

# Loyalty Next.js

## Alcance y entradas

Usa esta skill para cambiar o revisar rutas, límites entre servidor y cliente o
integración de features de este proyecto. Recibe la solicitud y los archivos
afectados; consulta el `AGENTS.md` de la raíz antes de actuar. No la uses para
un cambio exclusivo de pruebas o diseño visual.

## Flujo

1. Identifica la ruta en `src/app`, la feature en `src/features` y los recursos
   reutilizables en `src/shared`. Consulta la spec relevante y contrástala con
   el código y el contrato disponible.
2. Sigue la separación de responsabilidades de
   `.agents/architecture/frontend.architecture.md`, considerando las excepciones
   observadas en el `AGENTS.md` raíz. No inventes endpoints ni respuestas.
3. Mantén la frontera de componentes de servidor y cliente; usa `"use client"`
   cuando se requieran interacción o APIs del navegador. Para HTTP reutiliza
   `src/shared/services/api.ts` y los servicios existentes.
4. Implementa el cambio solicitado, contemplando estados y errores pertinentes.
   Para interfaz usa `loyalty-ui`; para pruebas usa `loyalty-vitest`.

## Criterios de calidad

- [ ] El cambio respeta la estructura y los contratos verificados.
- [ ] Los estados y errores pertinentes están contemplados.
- [ ] Las comprobaciones y limitaciones se informan con evidencia.

## Validación

Revisa las rutas y flujos afectados; ejecuta las comprobaciones aplicables de
`AGENTS.md` y reporta sus resultados y cualquier revisión no realizada.
