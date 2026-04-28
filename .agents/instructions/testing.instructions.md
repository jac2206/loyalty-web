# ⚙️ Testing Instructions

## 🎯 Objetivo

Estandarizar la creación de pruebas unitarias en el frontend.

---

## Reglas

- Usar Vitest como framework principal
- Usar Testing Library para componentes
- No hacer llamadas reales a la API
- Mockear dependencias externas
- Usar `vi.resetAllMocks()` en `beforeEach` cuando se usen mocks con respuestas `Once`.
- Evitar tests de hooks que dependan de un submit inmediatamente despues de multiples `setState`; preferir validar esa integracion desde el componente.

---

## Ubicación

- Los tests deben ir junto al archivo:
  - archivo.ts → archivo.test.ts
  - componente.tsx → componente.test.tsx

---

## Cobertura mínima

- Services → obligatorio
- Hooks → obligatorio
- Components → básico

---

## Naming

- describe → nombre de la función/componente
- it → comportamiento esperado

---

## Flujo

1. Identificar unidad (service, hook, component)
2. Mockear dependencias
3. Validar comportamiento
