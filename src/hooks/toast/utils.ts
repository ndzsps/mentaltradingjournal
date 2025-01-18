import { Action, State } from "@/types/toast"
import { reducer } from "./reducer"

export const TOAST_LIMIT = 1
export const TOAST_REMOVE_DELAY = 1000000

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let count = 0

export const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const listeners: Array<(state: State) => void> = []

export let memoryState: State = { toasts: [] }

export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}