# Auth Spec

## Objetivo
Permitir autenticación de usuarios.

## Endpoints

- POST /users/login
- POST /users/register
- GET /users/me

---

## Flujos

### Login

Input:
- email
- password

Output:
- token

Flow:
Form → useLogin → service → API

---

## Reglas

- Guardar token
- Manejar errores
- Redirigir a dashboard