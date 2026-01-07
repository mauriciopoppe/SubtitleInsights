export function SidebarHeader({
  onSync,
  onUpload,
  isUploadActive,
  uploadFilename
}: {
  onSync: () => void
  onUpload: () => void
  isUploadActive: boolean
  uploadFilename?: string
}) {
  return (
    <div className="si-sidebar-header">
      <div className="si-sidebar-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="si-sidebar-title">Subtitle Insights</div>
      </div>
      <div className="si-sidebar-controls">
        {/* Jump to Active Button */}
        <span className="si-sidebar-jump-btn" title="Jump to Active Segment" onClick={onSync}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          <span>Sync</span>
        </span>

        {/* Upload Button */}
        <span
          className={`si-sidebar-upload-btn ${isUploadActive ? 'active' : ''}`}
          title={isUploadActive ? `Loaded: ${uploadFilename}` : 'Upload Subtitles (SRT)'}
          onClick={onUpload}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
          </svg>
          <span>Upload</span>
        </span>
      </div>
    </div>
  )
}
