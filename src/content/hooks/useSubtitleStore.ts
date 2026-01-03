import { useState, useEffect } from 'preact/hooks'
import { store } from '../store'

export function useSubtitleStore () {
  const getStoreState = () => ({
    segments: store.getAllSegments(),
    aiStatus: store.aiStatus,
    warning: store.warning,
    systemMessage: store.systemMessage,
    isUploadActive: store.isUploadActive,
    uploadFilename: store.uploadFilename
  })

  const [state, setState] = useState(getStoreState())

  useEffect(() => {
    const handleUpdate = () => {
      setState(getStoreState())
    }

    store.addChangeListener(handleUpdate)

    // Initial fetch
    handleUpdate()

    return () => {
      // In a production app, we should remove the listener.
    }
  }, [])

  return state
}
