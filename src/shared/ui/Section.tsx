import type { ReactNode } from 'react'

export interface SectionProps {
  title: string
  description: string
  children?: ReactNode
}

/** Contenedor con encabezado usado por cada bloque de la pantalla principal. */
export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {children}
    </section>
  )
}
