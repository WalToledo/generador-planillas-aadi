# Especificación del Proyecto (SPEC.md) - Gestor de Canciones (Web Frontend)

## 1. Project Overview
Aplicación web de una sola página (SPA) moderna para registrar datos de canciones y exportarlos a Excel. La información debe persistir en el navegador para evitar pérdidas de datos.
La interfaz consta de tres partes principales:
1. **Entrada de datos:** Formulario para ingresar "Nombre de la canción", "Intérprete" y "Fecha de difusión". Incluye validación estricta de campos.
2. **Visualización y Gestión:** Tabla de canciones con opciones para **editar** y **eliminar** cada registro.
3. **Exportación:** Botón inferior para descargar la tabla en formato `.xlsx`.

## 2. Tech Stack & UI/UX
* **Entorno & Framework:** Vite + React (TypeScript).
* **Estilos:** Tailwind CSS v4 (plugin `@tailwindcss/vite`).
* **Alias de importación:** `@/` apunta a `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`).
* **Documentación:** MCP Context7 como herramienta de desarrollo para consultar documentación actualizada de las librerías. No es una dependencia de la aplicación.
* **Diseño:** Interfaz moderna con soporte para **Modo Claro y Modo Oscuro**. El **Modo Oscuro debe ser el predeterminado**.
* **Iconos:** `lucide-react` (para editar, eliminar y toggle de tema).
* **Exportación a Excel:** `xlsx` (SheetJS).
* **Persistencia:** `localStorage` (API nativa del navegador).

## 3. Data Model & State Management
* `songs`: Array de objetos `{ id: string, nombre: string, interprete: string, fecha: string }` persistido en `localStorage`. Usar interfaces de TypeScript para definir este tipo.
* `isDarkMode`: Booleano para controlar el tema visual, inicializado en `true` por defecto.

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
4. Una feature **no** importa de otra feature: si dos necesitan comunicarse, se componen en `app/`.
5. Cada módulo expone su API pública a través de su `index.ts` (*barrel*). Las importaciones apuntan al módulo (`@/features/songs`), nunca a rutas internas (`@/features/songs/hooks/useSongs`).

## 5. Directory Structure

```
src/
├── app/                          # Composición de la aplicación
│   ├── main.tsx                  # Punto de entrada (referenciado por index.html)
│   └── App.tsx                   # Layout y ensamblado de las features
├── features/                     # Capacidades del negocio
│   ├── songs/                    # Registrar y gestionar canciones
│   │   ├── components/           # SongForm (Step 3), SongTable (Step 4)
│   │   ├── hooks/                # useSongs (Step 2)
│   │   ├── types/
│   │   │   └── song.ts           # interface Song
│   │   └── index.ts              # API pública de la feature
│   └── spreadsheet/              # Generar y descargar la planilla .xlsx
│       ├── components/           # ExportButton (Step 5)
│       ├── lib/                  # exportSongsToExcel (Step 5)
│       └── index.ts
├── shared/                       # Transversal, sin lógica de negocio
│   ├── theme/
│   │   ├── useTheme.ts           # Estado del tema + persistencia
│   │   ├── ThemeToggle.tsx       # Botón claro/oscuro
│   │   └── index.ts
│   └── ui/
│       ├── Section.tsx           # Contenedor con encabezado
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

### Step 2: Estado y Persistencia (localStorage) (PENDING)
* **Acción:** Crear el estado `songs` tipado correctamente con TypeScript. Implementar un `useEffect` que lea de `localStorage` al cargar la página y otro que guarde cada vez que el array `songs` cambie.

### Step 3: Formulario de Entrada y Validación (Top Section) (PENDING)
* **Acción:** Crear el formulario con los 3 inputs usando Tailwind.
* **Lógica de Validación (Edge Case):** 
  - El botón "Agregar" debe estar **deshabilitado** (`disabled`) si alguno de los tres campos está vacío.
  - Al hacer *hover* sobre el botón deshabilitado, se debe mostrar un mensaje (mediante `title` o un *tooltip* personalizado de Tailwind) que diga: **"Debe ingresar datos en las 3 casillas"**.
* **Lógica de Envío:** Al hacer submit (cuando es válido), generar un ID único, agregar a `songs` y limpiar los inputs.

### Step 4: Tabla de Visualización y Acciones (Middle Section) (PENDING)
* **Acción:** Crear una tabla HTML con estilos modernos. Iterar sobre `songs` para las filas. Agregar una columna extra para botones de "Editar" y "Eliminar" (usar iconos).
* **Lógica de Eliminar:** Filtrar el array `songs` para remover el ID seleccionado.
* **Lógica de Editar:** Al hacer clic, cargar los datos de la fila en los inputs superiores y cambiar el texto/estado del botón principal a "Guardar Cambios".

### Step 5: Exportación a Excel (Bottom Section) (PENDING)
* **Acción:** Implementar la exportación usando la librería `xlsx`. Transformar el array `songs` (omitiendo el `id` interno) en una hoja de cálculo y descargar el archivo `canciones.xlsx`.

### Step 6: Preparación para Despliegue en Vercel (Deployment) (PENDING)
* **Acción:** Verificar que el script `build` en `package.json` funcione correctamente. Asegurar que no haya errores de tipado de TypeScript o variables sin usar que puedan hacer fallar la compilación automática de Vercel.