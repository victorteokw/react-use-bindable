import { createContext, useContext } from "react"
import { makeChildBinding, useBindable } from "./bindable"
import type { Binding } from './bindable'

export function makeBindable<T>(defaultValue: T) {
  const context = createContext<Binding<T>>({
    value: defaultValue,
    set: () => {},
    binding: makeChildBinding(defaultValue, () => {})
  })
  const Provider = ({ initialValue, children }: { initialValue?: T, children: React.ReactNode }) => {
    const binding = useBindable(initialValue ?? defaultValue)
    return <context.Provider value={binding}>{children}</context.Provider>
  }
  const useSharedBindable = () => useContext(context)
  return { SharedBindableProvider: Provider, useSharedBindable }
}
