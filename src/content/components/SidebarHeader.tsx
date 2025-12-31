import { useState, useRef } from 'preact/hooks';
import { SettingsDropdown } from './SettingsDropdown';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLSpanElement>(null);

  // Unified Status Icon Logic
  const getStatusIcon = () => {
    if (warning) {
      return (
        <span className="lle-sidebar-status-icon warning" title={warning}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </span>
      );
    }
    if (aiStatus.status !== 'none') {
      return (
        <span 
          className={`lle-sidebar-status-icon ai-${aiStatus.status}`} 
          title={aiStatus.message || aiStatus.status}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.08-.34.12-.57.12s-.41-.04-.57-.12l-7.9-4.44A1.001 1.001 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.08.34-.12.57-.12s.41.04.57.12l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z" />
          </svg>
        </span>
      );
    }
    return null;
  };

  return (
    <div className="lle-sidebar-header">
      <div className="lle-sidebar-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="lle-sidebar-title">LLE Transcript</div>
        {getStatusIcon()}
      </div>
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
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
          </svg>
          <span>Upload</span>
        </span>

        {/* Settings Button */}
        <span
          ref={settingsBtnRef}
          className={`lle-sidebar-settings-btn ${isDropdownOpen ? 'active' : ''}`}
          title="Settings"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ position: 'relative' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          
          <SettingsDropdown 
            isOpen={isDropdownOpen} 
            onClose={() => setIsDropdownOpen(false)}
            triggerRef={settingsBtnRef}
          >
            <div 
              className={`lle-settings-dropdown-item ${overlayEnabled ? 'enabled' : 'disabled'}`}
              title="Show translations directly on the video"
              onClick={onToggleOverlay}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 4H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14zM7 15h3v2H7v-2zm7 0h3v2h-3v-2zm-7-4h10v2H7v-2z" />
              </svg>
              <span>Overlay</span>
              <div className="lle-toggle-switch"></div>
            </div>

            <div 
              className={`lle-settings-dropdown-item ${aiEnabled ? 'enabled' : 'disabled'}`}
              title="Toggle AI-powered grammar and particle analysis"
              onClick={onToggleAI}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M7.5 5.6L10 0l2.5 5.6L18 8l-5.5 2.4L10 16 7.5 10.4 2 8l5.5-2.4z" />
              </svg>
              <span>Insights</span>
              <div className="lle-toggle-switch"></div>
            </div>
          </SettingsDropdown>
        </span>
      </div>
    </div>
  );
}
