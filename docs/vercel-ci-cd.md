# CI/CD con GitHub Actions y Vercel

El workflow [ci_cd.yml](../.github/workflows/ci_cd.yml) se ejecuta con cada
`push` a `master`. Instala las dependencias con Node.js 22, ejecuta ESLint y la
comprobación de TypeScript, descarga la configuración de producción de Vercel,
compila y despliega el resultado en **producción**. Si una etapa falla, las
siguientes no se ejecutan. Solo una ejecución de producción corre a la vez: la
que está en curso no se cancela, aunque GitHub puede reemplazar una ejecución
pendiente por una más reciente.

## Configuración en GitHub

En el repositorio de GitHub abre **Settings → Secrets and variables → Actions →
New repository secret** y agrega:

| Secret | Valor |
| --- | --- |
| `VERCEL_TOKEN` | Token de acceso de una cuenta con permiso para desplegar el proyecto. |
| `VERCEL_ORG_ID` | Identificador de la cuenta o equipo propietario del proyecto. |
| `VERCEL_PROJECT_ID` | Identificador del proyecto de Vercel existente. |

Para obtenerlos, crea un token desde [Vercel Tokens](https://vercel.com/account/tokens).
Los identificadores se encuentran en la configuración del proyecto o mediante
Vercel CLI. Desde la raíz del proyecto ejecuta:

```bash
npx vercel@65.14.0 login
npx vercel@65.14.0 link
```

Selecciona el equipo y **el proyecto existente**; luego consulta `orgId` y
`projectId` en `.vercel/project.json`. No compartas el token ni subas `.vercel/`
o archivos de entorno al repositorio.

## Configuración en Vercel

1. En el proyecto existente, abre **Settings → Environment Variables**.
2. Configura `NEXT_PUBLIC_API_URL` para **Production** con la URL pública del
   backend, incluido el prefijo de la API si corresponde. El workflow comprueba
   que sea una URL HTTP(S) no vacía; confirma también que corresponda al backend
   correcto. No uses `localhost` para un backend externo. Como la URL es pública,
   configúrala como variable normal que Vercel CLI pueda descargar para el build.
3. Si también usas la integración Git de Vercel, confirma que la rama de
   producción sea `master` y revisa el apartado de despliegues duplicados.

Las variables `NEXT_PUBLIC_` se incorporan al código del navegador: su contenido
es público y no debe contener credenciales. Los cambios de variables de Vercel
se aplican en despliegues nuevos; no modifican los despliegues anteriores.

## Evitar despliegues duplicados

Si el repositorio está conectado a Vercel mediante Git, Vercel puede desplegar
`master` automáticamente además de este workflow. Comprueba primero que los
secrets y la ejecución de GitHub Actions funcionen. Si quieres que **solo
GitHub Actions** controle la producción, puedes deshabilitar el despliegue Git
automático de `master` con la configuración siguiente en `vercel.json`,
conservando otras ramas para previews:

```json
{
  "git": {
    "deploymentEnabled": {
      "master": false
    }
  }
}
```

No se ha aplicado esta opción automáticamente porque la configuración actual de
tu proyecto en Vercel no se puede verificar desde el repositorio. Mientras el
despliegue Git automático siga activo, puede publicar cambios incluso si fallan
los controles de GitHub Actions. Revisa el resultado en **GitHub → Actions** y
en **Vercel → Deployments** antes de cambiar la integración.

## Pruebas pendientes

El workflow todavía **no ejecuta Vitest** como condición de despliegue: en la
última revisión había cuatro pruebas de transacciones fallidas por diferencias
entre pruebas e implementación. Resuelve el contrato esperado y agrégalas como
etapa obligatoria con `npm test -- --run` antes de considerar la suite cubierta
por CI. Las pruebas no están marcadas como aprobadas ni se ignoran silenciosamente.

## Referencias

- [GitHub Actions con Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)
- [Configuración Git de Vercel](https://vercel.com/docs/project-configuration/git-configuration)
- [Variables de entorno de Vercel](https://vercel.com/docs/environment-variables)
