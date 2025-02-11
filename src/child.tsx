import { Binding, makeChildBinding } from "./bindable"

export function childBindable<T, K extends keyof T>(useSharedBinding: () => Binding<T>, key: K) {
  return function useChildBinding() {
    const binding = useSharedBinding()
    return makeChildBinding(binding.value, binding.set)(key)
  }
}
