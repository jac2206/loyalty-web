# Instrucciones para agentes

Este archivo es el punto de entrada para trabajar en Loyalty Web. Lee las
instrucciones aplicables antes de modificar el proyecto; los documentos de
`.agents/` no se cargan automáticamente por estar en esa carpeta.

## Contexto y navegación

- El proyecto es un frontend Next.js con App Router y TypeScript. Las rutas
  están en `src/app`, las funcionalidades en `src/features` y lo compartido en
  `src/shared`. El cliente HTTP está en `src/shared/services/api.ts`.
- Consulta [.agents/AGENTS.md](.agents/AGENTS.md) para las reglas existentes y
  [.agents/context.md](.agents/context.md) para el contexto declarado.
- Para arquitectura y frontend, consulta [.agents/architecture/frontend.architecture.md](.agents/architecture/frontend.architecture.md),
  [.agents/architecture/frontend.patterns.md](.agents/architecture/frontend.patterns.md)
  y [.agents/instructions/frontend.instructions.md](.agents/instructions/frontend.instructions.md).
- Para interfaz, consulta [.agents/instructions/ui.instructions.md](.agents/instructions/ui.instructions.md)
  y [.agents/desing/design.system.md](.agents/desing/design.system.md).
- Para pruebas, consulta [.agents/instructions/testing.instructions.md](.agents/instructions/testing.instructions.md)
  y [.agents/testing/](.agents/testing/).
- Skills locales: usa [loyalty-nextjs](.agents/skills/loyalty-nextjs/SKILL.md)
  para rutas e integración Next.js, [loyalty-ui](.agents/skills/loyalty-ui/SKILL.md)
  para interfaces y [loyalty-vitest](.agents/skills/loyalty-vitest/SKILL.md)
  para pruebas. Si el entorno no las ofrece automáticamente, lee el archivo
  correspondiente; las guías `.skill.md` anteriores apuntan a estas skills.
- Antes de cambiar un flujo, revisa la spec pertinente en [.agents/specs/](.agents/specs/)
  y contrástala con el código; estas specs no documentan necesariamente todos
  los endpoints ni establecen por sí solas el contrato vigente del backend.

## Trabajo y validación

- Sigue la organización por features y el flujo UI → hook → service → API
  para flujos nuevos cuando aplique. Hay excepciones en el código existente:
  por ejemplo, `LogoutButton` usa el almacenamiento compartido y
  `transactionService` normaliza respuestas. No presupongas que todos los
  archivos cumplen literalmente las reglas históricas.
- Reutiliza componentes y servicios existentes, conserva el tipado estricto y
  no inventes endpoints ni contratos. No expongas secretos ni valores de
  archivos de entorno; `NEXT_PUBLIC_API_URL` es configuración pública del cliente.
- Preserva los cambios existentes del usuario y limita la edición a la tarea.
- Según el cambio, ejecuta `npm run lint`, `npx tsc --noEmit` y
  `npm test -- --run`; informa qué comprobaciones se ejecutaron y sus fallos.
  Los tests están junto al código y usan Vitest, Testing Library y jsdom.
- El código y la configuración son evidencia del comportamiento actual; si
  difieren de una guía o spec, señala la discrepancia y confirma el contrato
  antes de cambiar comportamiento. Las instrucciones específicas del usuario
  prevalecen sobre estas guías.

## Cambios guiados por especificación

- Usa las specs existentes como contexto y verifica su vigencia con el código
  y, cuando corresponda, con el contrato del backend. No crees un sistema de
  especificaciones paralelo para un cambio rutinario.
- Para cambios pequeños, identifica alcance y comportamiento esperado antes de
  editar; para cambios de mayor riesgo o ambigüedad, documenta criterios
  verificables, decisiones y tareas en el mecanismo existente o en un documento
  proporcionado al cambio. Distingue requisitos confirmados de supuestos.
- Relaciona el resultado con los criterios aplicables y registra las pruebas
  ejecutadas, fallos y comprobaciones pendientes. No declares verificado un
  cambio con validaciones requeridas pendientes o fallidas.
