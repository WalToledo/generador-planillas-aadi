# Generador de Planillas AADI

Aplicación web para registrar las difusiones de canciones —nombre, intérprete y fecha— y exportarlas a una planilla `.xlsx` lista para presentar ante **AADI** (Asociación Argentina de Intérpretes).

Funciona por completo en el navegador: no hay servidor, no hay base de datos y los datos no salen de tu máquina. Todo se guarda en el almacenamiento local del navegador y la planilla se genera del lado del cliente.

## Características

- **Carga con validación.** El botón *Agregar* permanece deshabilitado mientras falte alguno de los tres campos, y un tooltip explica por qué.
- **Edición y borrado por fila.** Cada canción de la tabla tiene sus iconos de editar y eliminar; al editar, los datos vuelven al formulario y el botón pasa a *Guardar Cambios*.
- **Exportación a Excel.** Genera `canciones.xlsx` con una fila por canción y las columnas *Nombre*, *Intérprete* y *Fecha*. El identificador interno no aparece en la planilla.
- **Persistencia automática.** Las canciones y la preferencia de tema se guardan en `localStorage` (claves `songs` y `theme`), así que cerrar la pestaña no borra nada.
- **Modo claro y oscuro.** Oscuro por defecto, con un botón para alternar. El tema se aplica antes del primer render, sin destello de pantalla clara al cargar.

## Cómo se usa

1. Completá **Nombre de la canción**, **Intérprete** y **Fecha de difusión**, y presioná *Agregar*.
2. La canción aparece en la tabla **Canciones registradas**. Desde ahí podés editarla o eliminarla con los iconos de la derecha.
3. Cuando termines de cargar, presioná **Descargar planilla** para bajar el archivo `canciones.xlsx`.

Las fechas se muestran y se exportan como `dd/mm/aaaa`.

## Stack

- **React 19 + TypeScript** sobre **Vite**
- **Tailwind CSS v4** mediante el plugin `@tailwindcss/vite` (la v4 ya no usa `tailwind.config.js`)
- **SheetJS** (`xlsx`) para generar el archivo Excel
- **lucide-react** para los iconos
- **Oxlint** como linter

## Puesta en marcha

```bash
git clone https://github.com/WalToledo/generador-planillas-aadi.git
cd generador-planillas-aadi
npm install
npm run dev
```

> [!IMPORTANT]
> `npm install` necesita acceso a `cdn.sheetjs.com`. La dependencia `xlsx` está declarada en `package.json` como URL de tarball del CDN oficial de SheetJS (`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`) y no como paquete del registro público de npm, que quedó congelado en la versión 0.18.5 y arrastra CVE-2023-30533 y una vulnerabilidad de ReDoS. Si instalás detrás de un proxy o en un CI sin salida a ese dominio, la instalación va a fallar.

### Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Chequeo de tipos (`tsc -b`) y build de producción en `dist/` |
| `npm run lint` | Analiza el código con Oxlint |
| `npm run preview` | Sirve localmente el build de producción |

## Estructura

El proyecto sigue **Screaming Architecture**: `src/` se organiza por capacidad de negocio y no por tipo técnico, de modo que abrir la carpeta revele qué hace la aplicación antes que qué framework usa. Por eso no hay carpetas globales `components/`, `hooks/` ni `utils/`.

```
src/
├── app/           # Composición: punto de entrada, layout y ensamblado
├── features/      # El dominio
│   ├── songs/         # Registrar y gestionar canciones
│   └── spreadsheet/   # Generar y descargar la planilla .xlsx
└── shared/        # Infraestructura transversal, sin lógica de negocio
    ├── theme/         # Tema visual y su persistencia
    └── ui/            # Componentes genéricos
```

Reglas de dependencia:

- `app/` puede importar de `features/` y de `shared/`.
- `features/` puede importar de `shared/`.
- `shared/` nunca importa de `features/` ni de `app/`.
- Una feature no importa de otra: si dos necesitan comunicarse, se componen en `app/`.

Cada módulo expone su API pública a través de su `index.ts`, así que las importaciones apuntan al módulo (`@/features/songs`) y nunca a rutas internas. El alias `@/` resuelve a `src/`.

## Estado

La aplicación está funcional: carga, edición, borrado, persistencia y exportación a Excel. Queda pendiente la preparación del despliegue.

El detalle de cada etapa, junto con las decisiones técnicas y sus motivos, está en [`SPEC.md`](./SPEC.md), que es la fuente de verdad del proyecto.
