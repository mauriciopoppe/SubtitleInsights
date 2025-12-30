import { h } from 'preact';

interface SidebarHeaderProps {
  onSync: () => void;
  onUpload: () => void;
  onToggleOverlay: () => void;
  onToggleAI: () => void;
  overlayEnabled: boolean;
  aiEnabled: boolean;
  aiStatus: {
    status: 'downloading' | 'ready' | 'error' | 'none';
    message?: string;
  };
  warning?: string;
  isUploadActive: boolean;
  uploadFilename?: string;
}

export function SidebarHeader({
  onSync,
  onUpload,
  onToggleOverlay,
  onToggleAI,
  overlayEnabled,
  aiEnabled,
  aiStatus,
  warning,
  isUploadActive,
  uploadFilename
}: SidebarHeaderProps) {
  return (
    <div className="lle-sidebar-header">
      <div className="lle-sidebar-title">LLE Transcript</div>
      <div className="lle-sidebar-controls">
        {/* Jump to Active Button */}
        <span
          className="lle-sidebar-jump-btn"
          title="Jump to Active Segment"
          onClick={onSync}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          <span>Sync</span>
        </span>

        {/* Upload Button */}
        <span
          className={`lle-sidebar-upload-btn ${isUploadActive ? 'active' : ''}`}
          title={isUploadActive ? `Loaded: ${uploadFilename}` : "Upload Subtitles (SRT)"}
          onClick={onUpload}
        >
          Upload
        </span>

        {/* Overlay Toggle Button */}
        <span
          className={`lle-sidebar-overlay-btn ${overlayEnabled ? 'enabled' : 'disabled'}`}
          title="Toggle On-Video Overlay"
          onClick={onToggleOverlay}
        >
          Overlay
        </span>

        {/* Grammar Explainer Toggle Button */}
        <span
          className={`lle-sidebar-grammar-btn ${aiEnabled ? 'enabled' : 'disabled'}`}
          title="Toggle AI Grammar Explanation"
          onClick={onToggleAI}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M7.5 5.6L10 0l2.5 5.6L18 8l-5.5 2.4L10 16 7.5 10.4 2 8l5.5-2.4z" />
          </svg>
          <span>AI</span>
        </span>

        {/* AI Status Icon */}
        {aiStatus.status !== 'none' && (
          <span
            className="lle-sidebar-ai-status"
            title={aiStatus.message || aiStatus.status}
            style={{
              display: 'inline-flex',
              marginLeft: '8px',
              cursor: 'help',
              color:
                aiStatus.status === 'downloading'
                  ? '#3ea6ff'
                  : aiStatus.status === 'ready'
                  ? '#2ba640'
                  : aiStatus.status === 'error'
                  ? '#ff4e43'
                  : 'inherit'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.08-.34.12-.57.12s-.41-.04-.57-.12l-7.9-4.44A1.001 1.001 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.08.34-.12.57-.12s.41.04.57.12l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z" />
            </svg>
          </span>
        )}

        {/* Warning Icon */}
        {warning && (
          <span
            className="lle-sidebar-warning"
            title={warning}
            style={{
              display: 'inline-flex',
              marginLeft: '8px',
              cursor: 'help',
              color: '#ffcc00'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
