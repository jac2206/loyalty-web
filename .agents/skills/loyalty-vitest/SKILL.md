---
name: loyalty-vitest
description: Crea, modifica y verifica pruebas de Loyalty Web con Vitest y Testing Library. Úsala para comportamiento de servicios, hooks o componentes de este repositorio, incluyendo diagnóstico de pruebas fallidas.
---

# Loyalty Vitest

## Alcance y entradas

Usa esta skill al trabajar con pruebas del proyecto. Identifica el comportamiento
esperado y el código afectado, y consulta el `AGENTS.md` raíz y
`.agents/instructions/testing.instructions.md`. La configuración está en
`vitest.config.ts` y `vitest.setup.ts`; los tests se ubican junto al código.

## Flujo

1. Contrasta la solicitud y los contratos disponibles con la implementación y
   las pruebas existentes. Ante una discrepancia, no supongas qué lado es correcto.
2. Selecciona casos de éxito, error y límites relevantes. Usa Vitest y, para
   componentes o hooks cuando corresponda, Testing Library. Aísla dependencias
   externas y evita HTTP real.
3. Verifica comportamiento observable y contratos relevantes; conserva la
   independencia de las pruebas y evita replicar detalles de implementación.
4. Con respuestas de mocks `Once`, sigue la limpieza indicada en las
   instrucciones de testing; evita depender del estado de un render anterior.

## Criterios de calidad

- [ ] Los casos verifican resultados relevantes y son independientes.
- [ ] Las dependencias externas están aisladas sin llamadas reales a la API.
- [ ] Los resultados y discrepancias se reportan sin inventar contratos.

## Validación

Ejecuta `npm test -- --run` o una selección pertinente e informa comando y
resultado. Si la ejecución falla o no arranca, conserva el fallo y su causa
observada en el informe; no declares que las pruebas pasaron.
