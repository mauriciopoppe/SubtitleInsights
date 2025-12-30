import { useState, useEffect } from 'preact/hooks';
import { store, SubtitleSegment } from '../store';

export function useSubtitleStore() {
  const [segments, setSegments] = useState<SubtitleSegment[]>(store.getAllSegments());

  useEffect(() => {
    const handleUpdate = () => {
      setSegments([...store.getAllSegments()]);
    };

    store.addChangeListener(handleUpdate);
    
    // Initial fetch in case it changed between initialization and effect
    handleUpdate();

    // Note: Our current store doesn't have a removeChangeListener method.
    // In a production app, we should add one to prevent leaks.
    // For now, we'll just subscribe.
  }, []);

  return segments;
}
