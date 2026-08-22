export interface TabItem<T extends string = string> {
  id: T
  label: string
}

export interface TabsProps<T extends string = string> {
  tabs: readonly TabItem<T>[]
  activeTab: T
  onTabChange: (id: T) => void
}

const baseTabClasses =
  'border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

/** Navegación por pestañas genérica: no conoce el dominio, recibe las pestañas y la activa por props. */
export function Tabs<T extends string>({ tabs, activeTab, onTabChange }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className="flex border-b border-slate-200 transition-colors dark:border-slate-700"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`${baseTabClasses} ${
              isActive
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
