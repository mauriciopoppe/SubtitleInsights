import { h } from 'preact';
import { useSubtitleStore } from '../hooks/useSubtitleStore';
import { useConfig } from '../hooks/useConfig';

export function HelloWorld() {
  const segments = useSubtitleStore();
  const config = useConfig();

  return (
    <div style={{ padding: '20px', color: 'white', background: '#444', marginBottom: '10px', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Preact Reactive Hook Test</h3>
      <p>Segments in store: <strong>{segments.length}</strong></p>
      <p>Extension Enabled: <strong>{config.isEnabled ? 'YES' : 'NO'}</strong></p>
      {config.isLoading && <p>Loading config...</p>}
      <p style={{ fontSize: '10px', opacity: 0.7 }}>This box verifies that Preact hooks are correctly bound to SubtitleStore and Config.</p>
    </div>
  );
}
