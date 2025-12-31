import { useState, useRef } from 'preact/hooks';
import { SettingsDropdown, SettingsItem } from './SettingsDropdown';

interface SidebarHeaderProps {
  onSync: () => void;
  onUpload: () => void;
  onToggleTranslation: () => void;
  onToggleAI: () => void;
  onTogglePauseOnHover: () => void;
  onToggleInsightsOverlay: () => void;
  onToggleInsightsSidebar: () => void;
  onToggleTranslationOverlay: () => void;
  onToggleTranslationSidebar: () => void;
  onOpenSettings: () => void;
  overlayEnabled: boolean; // Keeping this for now, but strictly it might be redundant for the toggle state if we use the granular ones
  aiEnabled: boolean;
  pauseOnHoverEnabled: boolean;
  isInsightsVisibleInOverlay: boolean;
  isInsightsVisibleInSidebar: boolean;
  isTranslationVisibleInOverlay: boolean;
  isTranslationVisibleInSidebar: boolean;
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
  onToggleTranslation,
  onToggleAI,
  onTogglePauseOnHover,
  onToggleInsightsOverlay,
  onToggleInsightsSidebar,
  onToggleTranslationOverlay,
  onToggleTranslationSidebar,
  onOpenSettings,
  overlayEnabled,
  aiEnabled,
  pauseOnHoverEnabled,
  isInsightsVisibleInOverlay,
  isInsightsVisibleInSidebar,
  isTranslationVisibleInOverlay,
  isTranslationVisibleInSidebar,
  aiStatus,
  warning,
  isUploadActive,
  uploadFilename
}: SidebarHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLSpanElement>(null);

  // Unified Status Icon Logic
  const getStatusIcon = () => {
    // ... (rest of getStatusIcon remains same)
  };

  const getMasterStatus = (overlay: boolean, sidebar: boolean): 'enabled' | 'disabled' | 'indeterminate' => {
    if (overlay && sidebar) return 'enabled';
    if (!overlay && !sidebar) return 'disabled';
    return 'indeterminate';
  };

  return (
    <div className="lle-sidebar-header">
      {/* ... header content ... */}
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
            <SettingsItem
              label="Translation"
              status={getMasterStatus(isTranslationVisibleInOverlay, isTranslationVisibleInSidebar)}
              title="Toggle all translations"
              onClick={onToggleTranslation}
              icon={<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 4H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14zM7 15h3v2H7v-2zm7 0h3v2h-3v-2zm-7-4h10v2H7v-2z" /></svg>}
            />
            <SettingsItem
              label="Visible in Overlay"
              isNested={true}
              status={isTranslationVisibleInOverlay ? 'enabled' : 'disabled'}
              onClick={onToggleTranslationOverlay}
            />
            <SettingsItem
              label="Visible in Sidebar"
              isNested={true}
              status={isTranslationVisibleInSidebar ? 'enabled' : 'disabled'}
              onClick={onToggleTranslationSidebar}
            />

            <SettingsItem
              label="AI Insights"
              status={getMasterStatus(isInsightsVisibleInOverlay, isInsightsVisibleInSidebar)}
              title="Toggle all AI-powered grammar analysis"
              onClick={onToggleAI}
              icon={<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7.5 5.6L10 0l2.5 5.6L18 8l-5.5 2.4L10 16 7.5 10.4 2 8l5.5-2.4z" /></svg>}
            />
            <SettingsItem
              label="Visible in Overlay"
              isNested={true}
              status={isInsightsVisibleInOverlay ? 'enabled' : 'disabled'}
              onClick={onToggleInsightsOverlay}
            />
            <SettingsItem
              label="Visible in Sidebar"
              isNested={true}
              status={isInsightsVisibleInSidebar ? 'enabled' : 'disabled'}
              onClick={onToggleInsightsSidebar}
            />

            <SettingsItem
              label="Hover Pause"
              status={pauseOnHoverEnabled ? 'enabled' : 'disabled'}
              title="Automatically pause video when hovering over the overlay"
              onClick={onTogglePauseOnHover}
              icon={<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>}
            />

            <SettingsItem
              label="Detailed Settings"
              title="Open full settings page"
              onClick={onOpenSettings}
              style={{ borderTop: '1px solid var(--yt-spec-10-percent-layer, rgba(255, 255, 255, 0.1))', marginTop: '4px' }}
              icon={<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>}
            />
          </SettingsDropdown>
        </span>
      </div>
    </div>
  );
}
