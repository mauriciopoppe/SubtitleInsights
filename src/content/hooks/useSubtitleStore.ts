import { useSyncExternalStore } from 'preact/compat'
import { store } from '../store'

export function useSubtitleStore() {
  const segments = useSyncExternalStore(store.subscribe, () => store.getAllSegments())
  const aiStatus = useSyncExternalStore(store.subscribe, () => store.aiStatus)
  const warning = useSyncExternalStore(store.subscribe, () => store.warning)
  const systemMessage = useSyncExternalStore(store.subscribe, () => store.systemMessage)
  const isUploadActive = useSyncExternalStore(store.subscribe, () => store.isUploadActive)
  const uploadFilename = useSyncExternalStore(store.subscribe, () => store.uploadFilename)

  return {
    segments,
    aiStatus,
    warning,
    systemMessage,
    isUploadActive,
    uploadFilename
  }
}
