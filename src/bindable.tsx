import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

export type KeyedOrIndexedBinding<T> = <K extends keyof T>(keyOrIndex: K) => Binding<T[K]>

export type Binding<T> = {
  value: T
  binding: KeyedOrIndexedBinding<T>
  set: Dispatch<SetStateAction<T>>
}

export function makeChildBinding<S>(
  state: S,
  setState: Dispatch<SetStateAction<S>>
) {
  return function childBinding<K extends keyof S>(key: K): Binding<S[K]> {
    const childState = state[key]
    const childSet: Dispatch<SetStateAction<S[K]>> = (value) => {
      value instanceof Function ?
        setState((prev) => ({ ...prev, [key]: value(prev[key]) })) :
        setState({ ...state, [key]: value })
    }
    const grandChildBinding = makeChildBinding(childState, childSet)
    return { value: childState, set: childSet, binding: grandChildBinding }
  }
}

export function useBindable<T>(initialValue: T): Binding<T> {
  const [value, set] = useState(initialValue)
  const binding = makeChildBinding(value, set)
  return { value, set, binding }
}
