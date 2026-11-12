# JAC en Loyalty Web

La identidad seleccionada por el usuario es JAC. Esta decisión reemplaza la
paleta azul anterior del proyecto. Se mantiene Next.js, Tailwind y los
componentes compartidos existentes.

## Referencias y aplicación

La fuente de colores es `JAC-COLOR-PALETTE.md` de la skill
`ui-ux-design-system`. `JAC-DESIGN-SYSTEM-v4.html` es la referencia visual:
se adaptan el panel destacado navy, la textura de cuadrícula, la jerarquía
tipográfica, las superficies y los iconos funcionales. El catálogo se usa como
referencia; los datos del catálogo no son datos de la aplicación.

Los colores y temas de la aplicación viven en `src/app/globals.css`. Los alias
Tailwind de colores anteriores conservan compatibilidad con los formularios.
Las clases de dashboard usan directamente las variables semánticas.
El panel navy de puntos es una superficie de marca en ambos temas; los demás
paneles siguen el tema seleccionado. Sus roles `--hero-*`, el color de texto
sobre acciones y el hover son adaptaciones de la aplicación.

La pila tipográfica contempla Montserrat e Inter con fallback a las fuentes
disponibles. Esas fuentes no están empaquetadas; no debe asumirse que siempre
se renderizan. El isotipo raster JAC existente se conserva y los SVG funcionales
en `Icon.tsx` son un subconjunto de los trazados incluidos en el catálogo.

## Pantalla de resumen

- El saldo es la información principal, con unidad visible y formato `es-CO`.
- El perfil complementa el saldo y conserva el enlace para actualizar datos.
- Acumulación, redención e historial tienen accesos y descripciones propias.
- El estado de cero puntos se diferencia del saldo no disponible.
- Carga, error y reintento mantienen feedback y nombres accesibles.
- No se muestran tendencias, porcentajes ni metas sin datos que los respalden.

La navegación y el tema se comparten entre pantallas. La preferencia elegida
persiste; sin una elección guardada se toma la del sistema.
La navegación autenticada es lateral en escritorio y se presenta como un
diálogo de menú en móvil. El cierre de sesión está disponible en el menú.

## Acceso y operaciones

- Inicio de sesión y registro comparten una presentación de marca adaptable.
- Acumular y redimir mantienen sus campos y validaciones, con una guía visual
  de apoyo y mensajes de error y éxito anunciables.
- El historial diferencia tipos y estados con texto e iconos, y contempla
  carga, error, lista vacía y paginación.

## Validación

La revisión visual usa datos de demostración interceptados en un navegador
aislado, sin operaciones sobre la API real. Se revisan ambos temas, tamaños de
escritorio, tableta y móvil, navegación, persistencia de tema y estados del saldo.
Los resultados de cada ejecución deben informarse con su alcance; estas
comprobaciones no equivalen a una auditoría integral de accesibilidad ni a una
validación de todos los flujos del backend.

Revisión realizada el 11 de noviembre de 2026 en Edge headless:

- Capturas del catálogo v4 y del resumen a 1440, 768 y 390 px en claro y oscuro.
  Inspección visual de escritorio y móvil, con ajustes posteriores de alineación,
  navegación y tipografía de cifras largas.
- Sin desbordamiento horizontal del documento en los tamaños probados.
- Carga, cero, saldo largo, vacío, error y actualización comprobados con fixtures.
- Cambio y persistencia de tema, foco visible y paso por Tab entre las acciones
  del saldo; el acceso a redención navega a su formulario.
- Rutas de login, registro, perfil, edición, acumulación, redención e historial:
  comprobación de desbordamiento y capturas móviles en ambos temas. Inspección
  visual adicional de registro claro y redención oscura.
- Contraste calculado de las combinaciones principales: 8.09:1 en la acción
  cyan/navy, 6.71:1 en el texto secundario del hero, 4.62:1 en el primario claro
  sobre blanco y 8.07:1 en texto secundario del tema oscuro.

Las capturas usan una cuenta y un saldo de demostración. No verifican la
integración real ni constituyen pruebas completas de envío de formularios.

En la revisión posterior de acceso y operaciones se verificaron las cinco rutas
en Edge headless a 1440, 768, 390 y 320 px en ambos temas, sin desbordamiento
horizontal del documento. Se inspeccionaron capturas de acceso, registro,
redención e historial y se probó el aviso de validación del login. Las respuestas
del historial fueron simuladas y no se hicieron transacciones reales.

En la revisión del menú lateral y el perfil se comprobaron resumen, perfil y
edición a 1440, 768, 390 y 320 px en ambos temas. En móvil se verificaron Tab,
Escape, retorno del foco, navegación al perfil y cierre de sesión con datos
simulados. El servidor de vista previa usó una copia aislada sin variables
locales y respuestas de demostración.

La compilación aislada con Webpack, ESLint y TypeScript pasaron. La suite tiene
37 pruebas aprobadas y las mismas 4 fallas previas de transacciones; las pruebas
de menú y perfil incluyen apertura y cierre, foco, sesión, datos y reintento.

En esta revisión pasaron ESLint, la compilación de Next.js y su comprobación
TypeScript. Vitest ejecutó 36 pruebas: 32 pasaron y 4 fallaron. Los fallos
preexistentes están en `transactionService.test.ts` y `useTransactions.test.ts`
y corresponden a expectativas de encabezados, forma de respuesta y argumentos
de paginación; requieren resolver el contrato esperado antes de corregirlos.
