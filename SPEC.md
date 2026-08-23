# Especificación del Proyecto (SPEC.md) - Gestor de Canciones (Web Frontend)

## 1. Project Overview
Aplicación web de una sola página (SPA) moderna para registrar datos de canciones y exportarlos como una Declaración Jurada Mensual de AADI en formato Excel. La información debe persistir en el navegador para evitar pérdidas de datos.

La interfaz se organiza en dos **pestañas**:
1. **Canciones:** la pestaña principal, con tres partes:
   - **Entrada de datos:** Formulario para ingresar "Nombre de la canción", "Intérprete", "Fecha de difusión" y "Cantidad de salidas". Incluye validación estricta de campos.
   - **Visualización y Gestión:** Tabla de canciones con opciones para **editar** y **eliminar** cada registro.
   - **Exportación:** Módulo inferior con los metadatos de la declaración (CUIT y Mes y Año) y el botón para descargar la planilla `.xlsx`.
2. **Datos del Usuario:** Formulario con los datos fijos del radiodifusor (razón social, domicilio, contacto, etc.), que se inyectan en la planilla exportada.

La exportación no es un volcado plano de la tabla: genera la **Declaración Jurada Mensual - Radiodifusores** con encabezado, bloque de datos del usuario y tabla de canciones, con estilos y bordes.

## 2. Tech Stack & UI/UX
* **Entorno & Framework:** Vite + React (TypeScript).
* **Estilos:** Tailwind CSS v4 (plugin `@tailwindcss/vite`).
* **Alias de importación:** `@/` apunta a `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`).
* **Documentación:** MCP Context7 como herramienta de desarrollo para consultar documentación actualizada de las librerías. No es una dependencia de la aplicación.
* **Diseño:** Interfaz moderna con soporte para **Modo Claro y Modo Oscuro**. El **Modo Oscuro debe ser el predeterminado**.
* **Iconos:** `lucide-react` (para editar, eliminar y toggle de tema).
* **Exportación a Excel:** `exceljs` (construcción del libro con estilos, bordes y celdas combinadas) + `file-saver` (descarga del blob generado). `@types/file-saver` como *devDependency*.
* **Persistencia:** `localStorage` (API nativa del navegador).

## 3. Data Model & State Management
Usar interfaces de TypeScript para definir todos estos tipos.

* `songs`: Array de objetos `{ id: string, nombre: string, interprete: string, fecha: string, salidas: number }` persistido en `localStorage` bajo la clave `songs`. `salidas` es la cantidad de veces que la canción salió al aire en el mes, entero ≥ 1.
* `userProfile`: Objeto con los datos fijos del radiodifusor, persistido en `localStorage` bajo la clave `userProfile`:
  `{ nombreComercial, razonSocial, domicilioFiscal, provincia, email, frecuenciaEmisora, whatsapp, localidad, codigoPostal, contacto, cuit }` (todos `string`).
* `isDarkMode`: Booleano para controlar el tema visual, inicializado en `true` por defecto.
* `activeTab`: Pestaña visible (`'songs' | 'profile'`). Estado de `app/`, **no** se persiste.
* **Nota:** el "Mes y Año" de la declaración es estado local del módulo de exportación y **no** se persiste: cambia en cada declaración y debe reingresarse. El CUIT sí se persiste, como parte de `userProfile`.

## 4. Architecture (Screaming Architecture)

La estructura de `src/` se organiza **por capacidad de negocio**, no por tipo técnico. Abrir el proyecto debe revelar de inmediato qué hace la aplicación (gestionar canciones, generar planillas), no qué framework usa. Por eso no existen carpetas globales `components/`, `hooks/` o `utils/` en la raíz de `src/`.

**Capas:**
* `app/` — Composición: punto de entrada, layout y ensamblado de las features.
* `features/` — El dominio. Cada carpeta es una capacidad del negocio y agrupa adentro todo lo suyo (componentes, hooks, tipos, lógica).
* `shared/` — Infraestructura transversal reutilizable, sin lógica de negocio (tema visual, componentes de UI genéricos).

**Reglas de dependencia:**
1. `app/` puede importar de `features/` y de `shared/`.
2. `features/` puede importar de `shared/`.
3. `shared/` **nunca** importa de `features/` ni de `app/`.
4. Una feature **no** importa de otra feature: si dos necesitan comunicarse, se componen en `app/`. Caso concreto: la exportación necesita `songs` (feature `songs`), `userProfile` (feature `userProfile`) y el `mesAnio` del propio módulo; los dos primeros llegan a `spreadsheet` **por props desde `app/App.tsx`**, y `spreadsheet` declara sus propias interfaces estructurales en vez de importar los tipos ajenos (mismo patrón que el `SongRow` actual).
5. Cada módulo expone su API pública a través de su `index.ts` (*barrel*). Las importaciones apuntan al módulo (`@/features/songs`), nunca a rutas internas (`@/features/songs/hooks/useSongs`).

## 5. Directory Structure

```
src/
├── app/                          # Composición de la aplicación
│   ├── main.tsx                  # Punto de entrada (referenciado por index.html)
│   └── App.tsx                   # Layout, pestañas y ensamblado de las features
├── features/                     # Capacidades del negocio
│   ├── songs/                    # Registrar y gestionar canciones
│   │   ├── components/
│   │   │   ├── SongForm.tsx      # Alta y edición
│   │   │   └── SongTable.tsx     # Listado con acciones de editar y eliminar
│   │   ├── hooks/
│   │   │   └── useSongs.ts       # Estado songs + persistencia
│   │   ├── types/
│   │   │   └── song.ts           # interface Song
│   │   └── index.ts              # API pública de la feature
│   ├── userProfile/              # Datos fijos del radiodifusor
│   │   ├── components/
│   │   │   └── UserProfileForm.tsx   # Cuadrícula de 2 columnas
│   │   ├── hooks/
│   │   │   └── useUserProfile.ts     # Estado userProfile + persistencia
│   │   ├── types/
│   │   │   └── userProfile.ts        # interface UserProfile
│   │   └── index.ts              # API pública de la feature
│   └── spreadsheet/              # Generar y descargar la planilla .xlsx
│       ├── components/
│       │   └── ExportPanel.tsx   # Inputs CUIT / Mes y Año + botón de descarga
│       ├── lib/
│       │   └── exportPlanillaAadi.ts  # Armado del libro con estilos y descarga
│       └── index.ts              # API pública de la feature
├── shared/                       # Transversal, sin lógica de negocio
│   ├── theme/
│   │   ├── useTheme.ts           # Estado del tema + persistencia
│   │   ├── ThemeToggle.tsx       # Botón claro/oscuro
│   │   └── index.ts
│   └── ui/
│       ├── Section.tsx           # Contenedor con encabezado
│       ├── Tabs.tsx              # Navegación por pestañas (genérica)
│       ├── formClasses.ts        # Clases Tailwind de inputs y labels
│       └── index.ts
└── index.css                     # Tailwind + variante dark

index.html                        # Script inline anti-FOUC + entrada a /src/app/main.tsx
vite.config.ts                    # Plugins React y Tailwind + alias @/
tsconfig.app.json                 # paths: @/* -> ./src/*
```

## 6. Implementation Steps (Para el Agente de IA)

### Step 1: Inicialización y Estructura (Tema Oscuro) (DONE)
* **Acción:** Crear la estructura de `App.tsx`. Configurar Tailwind v4 mediante el plugin `@tailwindcss/vite` y declarar el modo oscuro por clase con `@custom-variant dark (&:where(.dark, .dark *));` en `src/index.css`.
  - *Nota:* Tailwind v4 eliminó `tailwind.config.js`; la directiva `@custom-variant` reemplaza a `darkMode: 'class'` de v3.
* **Lógica:** Implementar un botón en la esquina superior para alternar entre modo claro y oscuro. La aplicación inicia en modo oscuro por defecto y la preferencia se persiste en `localStorage` bajo la clave `theme`.
* **Implementado en:** `src/shared/theme/useTheme.ts` (estado y persistencia), `src/shared/theme/ThemeToggle.tsx` (botón con iconos), `src/shared/ui/Section.tsx` (contenedor reutilizable), `src/app/App.tsx` (layout base con las tres secciones) e `index.html` (script inline que aplica la clase `dark` antes del primer render para evitar el flash de tema claro).

### Step 2: Estado y Persistencia (localStorage) (DONE)
* **Acción:** Crear el estado `songs` tipado correctamente con TypeScript. Implementar un `useEffect` que lea de `localStorage` al cargar la página y otro que guarde cada vez que el array `songs` cambie.
* **Implementado en:** `src/features/songs/hooks/useSongs.ts`, `src/features/songs/index.ts`, `src/app/App.tsx`.
* **Nota:** la clave de `localStorage` es `songs`. La lectura ocurre en el *lazy initializer* de `useState` y no en un `useEffect`: con dos efectos, el de guardado corre en el primer render y pisa lo guardado con `[]`. Es el mismo patrón de `src/shared/theme/useTheme.ts`.
* **Nota:** el hook expone `{ songs, setSongs }`; las mutaciones (`addSong`, `updateSong`, `deleteSong`) se agregan en los Steps 3 y 4 junto a la UI que las consume.

### Step 3: Formulario de Entrada y Validación (Top Section) (DONE)
* **Acción:** Crear el formulario con los 3 inputs usando Tailwind.
* **Lógica de Validación (Edge Case):** 
  - El botón "Agregar" debe estar **deshabilitado** (`disabled`) si alguno de los tres campos está vacío.
  - Al hacer *hover* sobre el botón deshabilitado, se debe mostrar un mensaje (mediante `title` o un *tooltip* personalizado de Tailwind) que diga: **"Debe ingresar datos en las 3 casillas"**.
* **Lógica de Envío:** Al hacer submit (cuando es válido), generar un ID único, agregar a `songs` y limpiar los inputs.
* **Implementado en:** `src/features/songs/components/SongForm.tsx`, `src/features/songs/hooks/useSongs.ts`, `src/features/songs/index.ts`, `src/app/App.tsx`.
* **Nota:** `SongForm` inicializa sus campos desde la prop `editingSong` en vez de sincronizarlos con un `useEffect` (oxlint rechaza `set-state-in-effect`); por eso, al conectar la edición hay que pasarle `key={editingSong?.id ?? 'new'}` para que se remonte al cambiar de canción.

### Step 4: Tabla de Visualización y Acciones (Middle Section) (DONE)
* **Acción:** Crear una tabla HTML con estilos modernos. Iterar sobre `songs` para las filas. Agregar una columna extra para botones de "Editar" y "Eliminar" (usar iconos).
* **Lógica de Eliminar:** Filtrar el array `songs` para remover el ID seleccionado.
* **Lógica de Editar:** Al hacer clic, cargar los datos de la fila en los inputs superiores y cambiar el texto/estado del botón principal a "Guardar Cambios".
* **Implementado en:** `src/features/songs/components/SongTable.tsx`, `src/features/songs/components/SongForm.tsx`, `src/features/songs/hooks/useSongs.ts`, `src/features/songs/index.ts`, `src/app/App.tsx`.
* **Nota:** la fecha se persiste como `YYYY-MM-DD` (formato nativo de `input type="date"`) y se muestra `dd/mm/aaaa` partiendo el string, no con `new Date()`, que lo interpreta como UTC y corre un día según la zona horaria. Toda exportación posterior debe respetar la misma restricción.

### Step 5: Exportación a Excel (Bottom Section) (DONE)
* **Acción:** Implementar la exportación usando la librería `xlsx`. Transformar el array `songs` (omitiendo el `id` interno) en una hoja de cálculo y descargar el archivo `canciones.xlsx`.
* **Implementado en:** `src/features/spreadsheet/lib/exportSongsToExcel.ts`, `src/features/spreadsheet/components/ExportButton.tsx`, `src/features/spreadsheet/index.ts`, `src/app/App.tsx`.
* **Nota (superada por el Step 8):** `xlsx` se instaló desde el CDN oficial de SheetJS (`npm i --save https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`) y no desde el registro público de npm, congelado en 0.18.5 y con CVE-2023-30533 más un ReDoS. Eso dejaba el build dependiendo de que ese CDN respondiera; el Step 8 retira la dependencia y el riesgo desaparece.
* **Nota:** la feature no importa el tipo `Song` (regla 4 de dependencias): define su propia interfaz `SongRow` sin `id`, a la que `Song` es asignable estructuralmente. Por lo mismo duplica el `formatFecha` de `SongTable`, ya que la fecha se exporta como texto `dd/mm/aaaa`.

### Step 6: Feature - Pestaña "Datos del Usuario" (DONE)
* **Acción:** Modificar el layout principal (`App.tsx`) para incluir un sistema de navegación por pestañas (Tabs) que permita alternar entre "Canciones" y "Datos del Usuario".
* **UI (Tabs):** El componente de pestañas vive en `src/shared/ui/Tabs.tsx`: es genérico, sin lógica de negocio, y recibe las pestañas y la activa por props. El estado `activeTab` vive en `App.tsx`.
* **UI (Formulario):** Crear la feature `userProfile` con su componente `UserProfileForm.tsx`. El formulario debe ser una cuadrícula (grid de 2 columnas) con los campos: Nombre comercial, Razón Social, Domicilio fiscal, Provincia, e-mail (Columna 1) y Frecuencia y emisora, Whatsapp, Localidad, Cód.Postal, Contacto (Columna 2).
* **Lógica:** Implementar `useUserProfile.ts` para persistir estos datos fijos en `localStorage` bajo la clave `userProfile`. Sigue el patrón de `useSongs`/`useTheme`: la lectura ocurre en el *lazy initializer* de `useState`, nunca en un `useEffect`.
* **Nota:** el objeto `UserProfile` incluye además el campo `cuit`, aunque **no** se edita en esta cuadrícula sino en el módulo de exportación (Step 7). Se guarda acá porque es un dato fijo del usuario, no de la declaración del mes.
* **Implementado en:** `src/features/userProfile/types/userProfile.ts`, `src/features/userProfile/hooks/useUserProfile.ts`, `src/features/userProfile/components/UserProfileForm.tsx`, `src/features/userProfile/index.ts`, `src/shared/ui/Tabs.tsx`, `src/shared/ui/formClasses.ts`, `src/shared/ui/index.ts`, `src/features/songs/components/SongForm.tsx`, `src/app/App.tsx`.
* **Nota:** el formulario persiste al tipear, sin botón "Guardar", igual que `useSongs` y `useTheme`; por eso `useUserProfile` expone `updateField(campo, valor)`, que es también el `onCuitChange` que necesita el Step 7.
* **Nota:** `inputClasses` y `labelClasses` se movieron de `SongForm.tsx` a `src/shared/ui/formClasses.ts`; el `ExportPanel` del Step 7 debe importarlas de ahí en vez de redefinirlas.

### Step 7: Refactor de UI - Módulo Exportar con Metadatos (DONE)
* **Acción:** Refactorizar la sección inferior de exportación (la que se hizo en el Step 5), renombrando `ExportButton.tsx` a `ExportPanel.tsx`.
* **UI:** Al lado del botón "Exportar", agregar dos inputs de texto obligatorios: "CUIT" y "Mes y Año".
* **Lógica:** El botón de exportación debe estar **deshabilitado** si alguno de estos dos campos está vacío, con el mismo patrón de `title`/tooltip usado en el `SongForm` del Step 3.
* **Estado:**
  - `cuit` llega **por props** (`cuit` + `onCuitChange`) desde `App.tsx`, que las conecta a `useUserProfile`: el valor se persiste, así el usuario no lo reescribe cada mes.
  - `mesAnio` es `useState` local de `ExportPanel` y no se persiste: cambia en cada declaración y debe reingresarse.
* **Implementado en:** `src/features/spreadsheet/components/ExportPanel.tsx`, `src/features/spreadsheet/index.ts`, `src/app/App.tsx`.
* **Nota:** el botón suma a las dos validaciones nuevas la condición previa de que haya al menos una canción; el tooltip cambia de texto según cuál falte.
* **Nota:** como `mesAnio` vive dentro del panel, el payload de exportación se arma ahí; por eso el Step 8 cambió la prop `cuit` por el `userProfile` completo, con el CUIT adentro.

### Step 8: Refactorización de Exportación a Excel - Planilla AADI (DONE)
* **Acción:** Reemplazar la librería `xlsx` por `exceljs` y `file-saver` para generar la Declaración Jurada formal con diseño y estilos. Desinstalar `xlsx`, instalar `exceljs`, `file-saver` y `@types/file-saver`. Renombrar `lib/exportSongsToExcel.ts` a `lib/exportPlanillaAadi.ts`.
* **Integración:** La función recibe un único parámetro `{ songs, userProfile, mesAnio }`, ensamblado en `App.tsx` a partir de `useSongs` (Step 2), `useUserProfile` (Step 6) y el estado local del `ExportPanel` (Step 7). El CUIT viaja dentro de `userProfile`.
* **Tipos:** la feature sigue sin importar tipos de otras features (regla 4): declara sus propias interfaces estructurales, a las que `Song` y `UserProfile` son asignables.
* **Diseño del Excel (Jerarquía Estricta):**
  1. **Encabezado y Metadatos:** Fila 1 combinada con título "DECLARACION JURADA MENSUAL - RADIODIFUSORES" (negrita, centrado). Debajo, celdas con bordes mostrando "CUIT: [Valor]" y "Mes y Año: [Valor]".
  2. **Datos del Usuario:** Dejar espacio. Fila combinada con fondo negro y texto blanco ("Datos del Usuario"). Debajo, inyectar la cuadrícula de 2 columnas con los datos extraídos de `userProfile`, aplicando bordes a todas las celdas.
  3. **Canciones:** Dejar espacio. Fila de encabezados ("Nombre de la Canción", "Intérprete", "Fecha de Difusión") con fondo gris claro, negrita y bordes. Iterar `songs` e inyectar los registros.
* **Nota:** la fecha se sigue formateando `dd/mm/aaaa` partiendo el string `YYYY-MM-DD`, nunca con `new Date()` (restricción heredada del Step 4).
* **Descarga:** Ejecutar `saveAs(blob, "Planilla_AADI.xlsx")`.
* **Implementado en:** `src/features/spreadsheet/lib/exportPlanillaAadi.ts`, `src/features/spreadsheet/components/ExportPanel.tsx`, `src/features/spreadsheet/index.ts`, `src/app/App.tsx`.
* **Nota:** el payload se arma en `ExportPanel`, no en `App.tsx`: `mesAnio` es estado local del panel (Step 7). `App.tsx` le pasa `songs` y `userProfile`.
* **Nota (ampliada por el Step 9):** la planilla usaba cuatro columnas, porque el bloque de datos del usuario son dos pares etiqueta/valor por fila; la tabla de canciones combina A:B para el nombre y así ocupa el mismo ancho. Con la columna de salidas la tabla pasa a cinco.
* **Nota:** `import ExcelJS from 'exceljs'` resuelve al bundle de navegador por el campo `browser` del paquete, sin polyfills de Node.
* **Nota:** ExcelJS pesa más que toda la app y sólo hace falta al descargar, así que `ExportPanel` carga `exportPlanillaAadi` con `import()` dinámico y queda en un chunk aparte (bundle inicial ~208 kB en vez de ~1.141 kB). Por eso el *barrel* de la feature **no** reexporta la función: un reexport estático la devolvería al bundle inicial. La descarga pasa a ser asíncrona y el botón muestra "Generando…" mientras corre.

### Step 9: Cantidad de Salidas por Canción (DONE)
* **Acción:** Registrar cuántas veces se difundió cada canción en el mes y llevar el dato de punta a punta: formulario, `localStorage`, tabla y planilla exportada.
* **Modelo:** `Song` suma `salidas: number` (entero ≥ 1).
* **UI (Formulario):** En "Nueva canción", un cuarto input `type="number"` (`min="1"`, `step="1"`) con label "Cantidad de salidas". **Viene precargado con `1`** y es editable: quien no lo toque declara una salida. Tras un alta exitosa vuelve a `1`, no a vacío, a diferencia de los otros tres campos.
* **Validación:** el campo es obligatorio; el botón se deshabilita si está vacío o no es un entero ≥ 1, y el tooltip pasa a decir **"Debe ingresar datos en las 4 casillas"**.
* **UI (Tabla):** nueva columna "Salidas" entre "Fecha" y "Acciones", alineada a la derecha por ser numérica.
* **Excel:** la planilla pasa de cuatro a **cinco columnas**. La tabla de canciones suma "Cantidad de Salidas" en la columna E, al lado de "Fecha de Difusión", con el mismo encabezado gris y bordes. El valor se escribe como número, no como texto, para poder sumar la columna.
* **Implementado en:** `src/features/songs/types/song.ts`, `src/features/songs/hooks/useSongs.ts`, `src/features/songs/components/SongForm.tsx`, `src/features/songs/components/SongTable.tsx`, `src/features/spreadsheet/lib/exportPlanillaAadi.ts`, `src/app/App.tsx`.
* **Nota (retrocompatibilidad):** las canciones guardadas antes de este Step no tienen `salidas`. `readStoredSongs` las normaliza a `1` al hidratar y el efecto de guardado las reescribe ya migradas; así la tabla nunca muestra `undefined` ni `NaN`.
* **Nota:** `borderRow` recibe un `lastCol` opcional (4 por defecto). El bloque de datos del usuario sigue bordeando cuatro columnas —son dos pares etiqueta/valor por fila— y sólo el encabezado y las filas de canciones piden 5; si no, la columna E quedaría vacía y bordeada al costado de los datos del usuario. Por el ancho real de la tabla, el título de la fila 1 combina `A1:E1` mientras que el bloque negro "Datos del Usuario" se mantiene en `A4:D4`.

### Step 10: Preparación para Despliegue en Vercel (Deployment) (DONE)
* **Acción:** Verificar que el script `build` en `package.json` funcione correctamente, ya con el stack migrado a `exceljs` (sin el tarball de CDN del Step 5). Asegurar que no haya errores de tipado de TypeScript o variables sin usar que puedan hacer fallar la compilación automática de Vercel.
* **Configuración de despliegue:** `package.json` declara `engines.node: ">=22.12.0"` y la raíz suma un `vercel.json` con `framework: "vite"` y un *rewrite* de `/(.*)` a `/index.html`.
* **Implementado en:** `package.json`, `vercel.json`, `README.md`.
* **Nota:** `npm run lint` y `npm run build` pasan sin errores ni advertencias de tipado; no hizo falta tocar nada de `src/`. El build emite `index-*.js` de ~208 kB y `exportPlanillaAadi-*.js` de ~934 kB en un chunk aparte, que es exactamente el corte que buscaba el import dinámico del Step 8.
* **Nota:** Vite advierte que un chunk supera los 500 kB. Es el chunk *lazy* de ExcelJS, que sólo se descarga al exportar; se deja como está en vez de subir `chunkSizeWarningLimit`, porque silenciar el aviso escondería una regresión futura del *code splitting*.
* **Nota:** el pin de Node es un requisito real, no una precaución: Vite 8 exige ≥ 20.19 / 22.12. Sin `engines`, Vercel elige el default de la cuenta y el build deja de ser determinista.
* **Nota:** el *rewrite* de `vercel.json` no hace falta hoy —la app es una sola ruta, sin router— pero evita el 404 en recarga si más adelante se agregan rutas.
* **Nota:** el `README.md` se actualizó en el mismo Step: documentaba `xlsx`/SheetJS y la advertencia sobre `cdn.sheetjs.com`, ambos retirados en el Step 8, además de "los tres campos" y `canciones.xlsx`. Ahora refleja las dos pestañas, la cantidad de salidas, `Planilla_AADI.xlsx` y el requisito de Node.
* **Verificado:** con `npm run preview` sobre el build de producción se recorrió el flujo completo —alta con salidas, persistencia tras recargar, datos del usuario y descarga—, y la planilla resultante contiene el encabezado, los metadatos, el bloque del radiodifusor y la fila de la canción con las salidas escritas como número.
