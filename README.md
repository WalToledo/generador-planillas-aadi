# Generador de Planillas AADI

Aplicación web para registrar las difusiones de canciones —nombre, intérprete, fecha y cantidad de salidas— y exportarlas como **Declaración Jurada Mensual - Radiodifusores** en formato `.xlsx`, lista para presentar ante **AADI** (Asociación Argentina de Intérpretes).

Funciona por completo en el navegador: no hay servidor, no hay base de datos y los datos no salen de tu máquina. Todo se guarda en el almacenamiento local del navegador y la planilla se genera del lado del cliente.

## Características

- **Dos pestañas.** *Canciones*, con la carga, la tabla y el módulo de exportación; y *Datos del Usuario*, con los datos fijos del radiodifusor que se inyectan en la planilla.
- **Carga con validación.** El botón *Agregar* permanece deshabilitado mientras falte alguno de los cuatro campos, y un tooltip explica por qué. La cantidad de salidas viene precargada en `1`: quien no la toque declara una difusión.
- **Edición y borrado por fila.** Cada canción de la tabla tiene sus iconos de editar y eliminar; al editar, los datos vuelven al formulario y el botón pasa a *Guardar Cambios*.
- **Exportación a Excel.** Genera `Planilla_AADI.xlsx` con el diseño de la declaración jurada: título, metadatos de CUIT y Mes y Año, bloque de datos del usuario en cuadrícula de dos columnas y la tabla de canciones con encabezados, bordes y estilos. El identificador interno no aparece en la planilla.
- **Persistencia automática.** Canciones, datos del usuario y preferencia de tema se guardan en `localStorage` (claves `songs`, `userProfile` y `theme`), así que cerrar la pestaña no borra nada. El *Mes y Año* es la excepción a propósito: cambia en cada declaración y se reingresa.
- **Modo claro y oscuro.** Oscuro por defecto, con un botón para alternar. El tema se aplica antes del primer render, sin destello de pantalla clara al cargar.

## Cómo se usa

1. En la pestaña **Datos del Usuario**, completá los datos fijos del radiodifusor (razón social, domicilio, contacto, etc.). Se guardan solos, sin botón de guardar, y sólo hace falta hacerlo una vez.
2. En **Canciones**, completá **Nombre de la canción**, **Intérprete**, **Fecha de difusión** y **Cantidad de salidas**, y presioná *Agregar*.
3. La canción aparece en la tabla **Canciones registradas**. Desde ahí podés editarla o eliminarla con los iconos de la derecha.
4. En el módulo **Exportar**, completá **CUIT** (se persiste con el perfil) y **Mes y Año** de la declaración, y presioná **Descargar planilla** para bajar `Planilla_AADI.xlsx`.

Las fechas se muestran y se exportan como `dd/mm/aaaa`.

## Stack

- **React 19 + TypeScript** sobre **Vite**
- **Tailwind CSS v4** mediante el plugin `@tailwindcss/vite` (la v4 ya no usa `tailwind.config.js`)
- **ExcelJS** para construir el libro con estilos, bordes y celdas combinadas, y **file-saver** para descargar el blob generado
- **lucide-react** para los iconos
- **Oxlint** como linter

ExcelJS pesa más que toda la aplicación y sólo hace falta al momento de descargar, así que se carga con un `import()` dinámico y queda en un chunk aparte: el bundle inicial ronda los 208 kB en vez de superar el megabyte.

## Puesta en marcha

Requiere **Node.js ≥ 22.12** (lo exige Vite 8; está declarado en `engines`).

```bash
git clone https://github.com/WalToledo/generador-planillas-aadi.git
cd generador-planillas-aadi
npm install
npm run dev
```

### Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Chequeo de tipos (`tsc -b`) y build de producción en `dist/` |
| `npm run lint` | Analiza el código con Oxlint |
| `npm run preview` | Sirve localmente el build de producción |

## Despliegue

Está preparado para **Vercel**. `vercel.json` fija el framework en `vite` para no depender de la autodetección y agrega un *rewrite* que manda cualquier ruta a `index.html`, de modo que la aplicación no devuelva 404 si en el futuro suma rutas. No hay variables de entorno ni backend: el build produce estáticos y se sirven tal cual.

## Estructura

El proyecto sigue **Screaming Architecture**: `src/` se organiza por capacidad de negocio y no por tipo técnico, de modo que abrir la carpeta revele qué hace la aplicación antes que qué framework usa. Por eso no hay carpetas globales `components/`, `hooks/` ni `utils/`.

```
src/
├── app/           # Composición: punto de entrada, layout y ensamblado
├── features/      # El dominio
│   ├── songs/         # Registrar y gestionar canciones
│   ├── userProfile/   # Datos fijos del radiodifusor
│   └── spreadsheet/   # Generar y descargar la planilla .xlsx
└── shared/        # Infraestructura transversal, sin lógica de negocio
    ├── theme/         # Tema visual y su persistencia
    └── ui/            # Componentes genéricos
```

Reglas de dependencia:

- `app/` puede importar de `features/` y de `shared/`.
- `features/` puede importar de `shared/`.
- `shared/` nunca importa de `features/` ni de `app/`.
- Una feature no importa de otra: si dos necesitan comunicarse, se componen en `app/`. Por eso `spreadsheet` declara sus propias interfaces estructurales en vez de importar `Song` o `UserProfile`.

Cada módulo expone su API pública a través de su `index.ts`, así que las importaciones apuntan al módulo (`@/features/songs`) y nunca a rutas internas. El alias `@/` resuelve a `src/`.

## Estado

La aplicación está completa y lista para desplegar: carga con validación, edición, borrado, datos del usuario, persistencia y exportación de la declaración jurada con estilos.

El detalle de cada etapa, junto con las decisiones técnicas y sus motivos, está en [`SPEC.md`](./SPEC.md), que es la fuente de verdad del proyecto.
