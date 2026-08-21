---
name: spec-update
description: Actualiza SPEC.md al terminar un Step de implementación. Úsala cuando se complete cualquier Step del SPEC, cuando haya que marcar un Step como DONE, o cuando una decisión técnica se aparte de lo que el SPEC especifica. Mantiene el SPEC como especificación, no como bitácora.
allowed-tools: Read, Edit, Bash
---

# Actualizar SPEC.md al cerrar un Step

`SPEC.md` es la **especificación** del proyecto, no un registro de trabajo. Describe qué debe hacer la aplicación y en qué estado está cada Step. La historia de cómo se llegó ahí vive en git.

El riesgo al documentar un Step no es olvidar información: es agregar de más. Un SPEC que acumula narrativa deja de ser útil como especificación alrededor del tercer o cuarto Step. Ante la duda, escribí menos.

## Paso 1: Verificar antes de marcar

`(DONE)` significa **verificado**, no "escribí el código". Antes de tocar `SPEC.md`:

```bash
npm run build && npm run lint
```

Si alguno falla, **no marques el Step como `(DONE)`**. Reportá el error, arreglalo y volvé a correrlo. Este proyecto compila con `noUnusedLocals`, `noUnusedParameters` y `verbatimModuleSyntax` activos: son justamente los errores que romperían el despliegue automático en Vercel (Step 6). Detectarlos en cada Step evita acumularlos para el final.

## Paso 2: Qué escribir

Sólo estos cuatro elementos. Nada más.

1. **Marcador de estado** — en el título del Step, cambiar `(PENDING)` por `(DONE)`.

2. **Línea `Implementado en:`** — las rutas reales de los archivos creados o modificados, entre backticks. Rutas, no descripciones de lo que hace el código.

3. **Línea `Nota:`** — *sólo si* corresponde. Se justifica en dos casos:
   - La implementación se apartó de lo que el SPEC especifica (por ejemplo: el SPEC pedía una API que ya no existe en la versión vigente de la librería).
   - Hay una restricción no obvia que condiciona Steps futuros (por ejemplo: el nombre de una clave de `localStorage`, o un formato de dato que la exportación tendrá que respetar).

   Una línea, incluyendo el porqué. Si no aplica ninguno de los dos casos, no agregues la línea.

4. **Árbol de `## 5. Directory Structure`** — actualizalo si el Step creó archivos nuevos, y borrá el comentario `(Step N)` de las entradas que quedaron completadas.

## Paso 3: Qué NO escribir

Esta lista es la parte importante de la skill.

- ❌ **Narrativa del proceso.** Qué se intentó, qué falló, cómo se arregló, cuántos intentos llevó. Eso es historia de git.
- ❌ **Fragmentos de código.** El SPEC apunta a los archivos; el código vive en los archivos.
- ❌ **Reescribir la `Acción` o la `Lógica` originales del Step.** Describen la *intención* y se conservan intactas aunque la implementación haya diferido. Un desvío se anota en `Nota:`, nunca reformulando el requisito: perder el requisito original hace imposible saber después si se cumplió.
- ❌ **Detalles deducibles del código.** Que un componente usa `useState`, que un botón tiene `onClick`, que un hook devuelve un objeto.
- ❌ **Números de versión de dependencias.** Envejecen mal y ya están en `package.json`.
- ❌ **Secciones nuevas de nivel `##`**, salvo que el usuario lo pida explícitamente.
- ❌ **Marcar `(DONE)` un Step que no se implementó completo.** Si quedó algo afuera, decilo en la respuesta al usuario y dejá el Step en `(PENDING)`.

## Paso 4: Formato de referencia

Así se ve un Step bien cerrado:

```markdown
### Step 2: Estado y Persistencia (localStorage) (DONE)
* **Acción:** Crear el estado `songs` tipado correctamente con TypeScript...   ← intacto
* **Implementado en:** `src/features/songs/hooks/useSongs.ts`, `src/features/songs/types/song.ts`
* **Nota:** la clave de localStorage es `songs-v1`; se versiona por si cambia el modelo.
```

Dos o tres líneas agregadas. Si estás escribiendo un párrafo, te fuiste de alcance.

El Step 1, ya cerrado en `SPEC.md`, sirve como ejemplo real: leelo antes de escribir para replicar la forma.

## Paso 5: Respetar la arquitectura

Antes de documentar, confirmá que los archivos nuevos están donde corresponde según las secciones **4. Architecture** y **5. Directory Structure** del SPEC:

- Lógica de dominio en `src/features/<feature>/`; nada de dominio en `shared/`.
- Infraestructura transversal reutilizable en `src/shared/`.
- Cada módulo expone su API por su `index.ts`; los imports apuntan al módulo (`@/features/songs`), nunca a rutas internas.
- Ninguna feature importa de otra feature.

Si un archivo quedó fuera de la estructura, movelo antes de documentarlo. Documentar una ubicación incorrecta la vuelve permanente.

## Paso 6: Cierre

1. Releé la sección que editaste: ¿se lee como especificación o como reporte de trabajo? Si es lo segundo, recortá.
2. Verificá que ningún otro Step haya quedado con el marcador equivocado.
3. En la respuesta al usuario, mencioná qué se agregó al SPEC en una línea. El detalle del trabajo va en la respuesta, no en el documento.
