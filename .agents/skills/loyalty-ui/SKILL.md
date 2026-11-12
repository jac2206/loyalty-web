---
name: loyalty-ui
description: Implementa o revisa interfaces, formularios y estados visuales de Loyalty Web siguiendo sus componentes y diseño. Úsala en cambios de UI de este repositorio; no sustituye una auditoría formal de accesibilidad.
---

# Loyalty UI

## Alcance y entradas

Usa esta skill para pantallas, componentes y formularios de Loyalty Web. Parte
de la solicitud y del flujo afectado; consulta el `AGENTS.md` raíz, las reglas
de `.agents/instructions/ui.instructions.md` y el diseño en
`.agents/desing/design.system.md`. No afirma conformidad de accesibilidad.

## Flujo

1. Inspecciona la pantalla y los componentes de `src/shared/components` y
   de la feature antes de añadir componentes o variantes.
2. Mantén Tailwind y los patrones existentes; adapta la composición al flujo
   real sin imponer una estructura fija a todas las pantallas.
3. Asocia etiquetas y controles, comunica errores y muestra operaciones
   pendientes en formularios; deshabilita el envío mientras corresponda.
4. Considera teclado, legibilidad, tamaños de pantalla y estados de carga,
   error, vacío y éxito cuando apliquen. Coordina pruebas con `loyalty-vitest`.

## Criterios de calidad

- [ ] La interfaz reutiliza patrones pertinentes y conserva la identidad visual.
- [ ] Los estados y controles relevantes son comprensibles para el usuario.
- [ ] Se informan las comprobaciones realizadas y las pendientes.

## Validación

Comprueba interacción, estados y anchos pertinentes según el cambio. Indica si
no se revisó visualmente o con teclado y evita afirmar conformidad sin evidencia.
