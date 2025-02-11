import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

export type KeyedOrIndexedBinding<T> = <K extends keyof T>(keyOrIndex: K) => Binding<T[K]>

export type Binding<T> = {
  value: T
  binding: KeyedOrIndexedBinding<T>
  set: Dispatch<SetStateAction<T>>
}

function makeChildBinding<S>(
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

export default function useBindable<T>(initialValue: T): Binding<T> {
  const [state, setState] = useState(initialValue)
  const binding = makeChildBinding(state, setState)
  return { value: state, set: setState, binding }
}
