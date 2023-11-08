export enum StorageType {
  // noinspection JSUnusedGlobalSymbols
  Local = 'local',
  Sync = 'sync',
  Managed = 'managed',
  Session = 'session',
}

export interface IStorage<D> {
  get(): Promise<D | null>
  set(updateFn: (previous: D) => D): Promise<D>
  getSnapshot(): D
  subscribe(listener: () => void): () => void
}

export function createStorage<D>(
  key: string,
  fallback: D,
  config?: { storageType?: StorageType },
): IStorage<D> {
  let cache: D | null = null
  let listeners: Array<() => void> = []
  const storageType = config?.storageType ?? StorageType.Local

  const _getDataFromStorage = async (): Promise<D> => {
    if (chrome.storage[storageType] === undefined) {
      throw new Error(
        `Check your storage permission into manifest.json: ${storageType} is not defined`,
      )
    }
    const value = await chrome.storage[storageType].get([key])
    return value?.[key] ?? fallback
  }

  const _emitChange = () => {
    listeners.forEach((listener) => listener())
  }

  const set = async (updateFn: (previous: D) => D): Promise<D> => {
    cache = updateFn(cache)
    await chrome.storage[storageType].set({ [key]: cache })
    _emitChange()
    return cache
  }

  const subscribe = (listener: () => void) => {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const getSnapshot = () => {
    return cache
  }

  _getDataFromStorage().then((data) => {
    cache = data
    _emitChange()
  })

  return {
    get: _getDataFromStorage,
    set,
    getSnapshot,
    subscribe,
  }
}
