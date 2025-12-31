import { useState, useEffect, useRef } from 'preact/hooks';
import { SidebarHeader } from './SidebarHeader';
import { SidebarList } from './SidebarList';
import { useSubtitleStore } from '../hooks/useSubtitleStore';
import { useConfig } from '../hooks/useConfig';
import { Config } from '../config';
import { store } from '../store';

export function SidebarApp() {
  const {
    segments,
    aiStatus,
    warning,
    isUploadActive,
    uploadFilename
  } = useSubtitleStore();
  const config = useConfig();
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with video time
  useEffect(() => {
    const video = document.querySelector('video');
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTimeMs(video.currentTime * 1000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const handleSync = () => {
    const activeItem = document.querySelector('.lle-sidebar-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const { segments: newSegments, errors } = store.parseSRTData(content);

        if (errors.length > 0) {
          console.group("[LLE] Import Errors");
          errors.forEach((err) => console.error(err));
          console.groupEnd();
          store.setWarning("Import errors occurred. Check console for details.");
        } else {
          store.setWarning(undefined);
        }

        if (newSegments && newSegments.length > 0) {
          store.loadCustomSegments(newSegments);
          store.setUploadStatus(true, file.name);
          console.log(`[LLE] Successfully loaded ${newSegments.length} segments from ${file.name}`);
        } else {
          alert("No valid segments found in the SRT file.");
        }
      } catch (err) {
        console.error("[LLE] Failed to parse SRT file", err);
        alert("Failed to parse SRT file.");
      }
    };
    reader.readAsText(file);
  };

  const handleToggleOverlay = async () => {
    const current = await Config.getIsOverlayEnabled();
    await Config.setIsOverlayEnabled(!current);
  };

  const handleToggleAI = async () => {
    const current = await Config.getIsGrammarExplainerEnabled();
    await Config.setIsGrammarExplainerEnabled(!current);
  };

  if (!config.isEnabled) return null;

  return (
    <div id="lle-sidebar" style={{ display: 'flex' }}>
      <input
        type="file"
        accept=".srt"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <SidebarHeader
        onSync={handleSync}
        onUpload={handleUploadClick}
        onToggleOverlay={handleToggleOverlay}
        onToggleAI={handleToggleAI}
        overlayEnabled={config.isOverlayEnabled}
        aiEnabled={config.isGrammarEnabled}
        aiStatus={aiStatus}
        warning={warning}
        isUploadActive={isUploadActive}
        uploadFilename={uploadFilename}
      />
      <SidebarList
        segments={segments}
        currentTimeMs={currentTimeMs}
      />
    </div>
  );
}
