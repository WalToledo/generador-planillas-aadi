# Especificación del Proyecto (SPEC.md) - Gestor de Canciones (Web Frontend)

## 1. Project Overview
Aplicación web de una sola página (SPA) moderna para registrar datos de canciones y exportarlos a Excel. La información debe persistir en el navegador para evitar pérdidas de datos.
La interfaz consta de tres partes principales:
1. **Entrada de datos:** Formulario para ingresar "Nombre de la canción", "Intérprete" y "Fecha de difusión". Incluye validación estricta de campos.
2. **Visualización y Gestión:** Tabla de canciones con opciones para **editar** y **eliminar** cada registro.
3. **Exportación:** Botón inferior para descargar la tabla en formato `.xlsx`.

## 2. Tech Stack & UI/UX
* **Entorno & Framework:** Vite + React (TypeScript).
* **Integración de Contexto:** MCP Context7.
* **Estilos:** Tailwind CSS.
* **Diseño:** Interfaz moderna con soporte para **Modo Claro y Modo Oscuro**. El **Modo Oscuro debe ser el predeterminado**.
* **Iconos:** `lucide-react` (para editar, eliminar y toggle de tema).
* **Exportación a Excel:** `xlsx` (SheetJS).
* **Persistencia:** `localStorage` (API nativa del navegador).

## 3. Data Model & State Management
* `songs`: Array de objetos `{ id: string, nombre: string, interprete: string, fecha: string }` persistido en `localStorage`. Usar interfaces de TypeScript para definir este tipo.
* `isDarkMode`: Booleano para controlar el tema visual, inicializado en `true` por defecto.

## 4. Implementation Steps (Para el Agente de IA)

### Step 1: Inicialización y Estructura (Tema Oscuro)
* **Acción:** Crear la estructura de `App.tsx`. Configurar Tailwind para soportar modo oscuro (`darkMode: 'class'` en la configuración).
* **Lógica:** Implementar un botón o switch en la esquina superior para alternar entre modo claro y oscuro. Asegurar que la aplicación inicie en modo oscuro por defecto. Integrar MCP Context7 según las mejores prácticas.

### Step 2: Estado y Persistencia (localStorage)
* **Acción:** Crear el estado `songs` tipado correctamente con TypeScript. Implementar un `useEffect` que lea de `localStorage` al cargar la página y otro que guarde cada vez que el array `songs` cambie.

### Step 3: Formulario de Entrada y Validación (Top Section)
* **Acción:** Crear el formulario con los 3 inputs usando Tailwind.
* **Lógica de Validación (Edge Case):** 
  - El botón "Agregar" debe estar **deshabilitado** (`disabled`) si alguno de los tres campos está vacío.
  - Al hacer *hover* sobre el botón deshabilitado, se debe mostrar un mensaje (mediante `title` o un *tooltip* personalizado de Tailwind) que diga: **"Debe ingresar datos en las 3 casillas"**.
* **Lógica de Envío:** Al hacer submit (cuando es válido), generar un ID único, agregar a `songs` y limpiar los inputs.

### Step 4: Tabla de Visualización y Acciones (Middle Section)
* **Acción:** Crear una tabla HTML con estilos modernos. Iterar sobre `songs` para las filas. Agregar una columna extra para botones de "Editar" y "Eliminar" (usar iconos).
* **Lógica de Eliminar:** Filtrar el array `songs` para remover el ID seleccionado.
* **Lógica de Editar:** Al hacer clic, cargar los datos de la fila en los inputs superiores y cambiar el texto/estado del botón principal a "Guardar Cambios".

### Step 5: Exportación a Excel (Bottom Section)
* **Acción:** Implementar la exportación usando la librería `xlsx`. Transformar el array `songs` (omitiendo el `id` interno) en una hoja de cálculo y descargar el archivo `canciones.xlsx`.

### Step 6: Preparación para Despliegue en Vercel (Deployment)
* **Acción:** Verificar que el script `build` en `package.json` funcione correctamente. Asegurar que no haya errores de tipado de TypeScript o variables sin usar que puedan hacer fallar la compilación automática de Vercel.