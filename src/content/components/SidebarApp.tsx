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
  const hasInitiallyScrolled = useRef(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset scroll tracker when segments are cleared (usually on video change)
  useEffect(() => {
    if (segments.length === 0) {
      hasInitiallyScrolled.current = false;
    }
  }, [segments.length]);

  // Handle initial auto-scroll when segments arrive
  useEffect(() => {
    if (segments.length > 0 && !hasInitiallyScrolled.current) {
      const video = document.querySelector('video');
      const timeMs = video ? video.currentTime * 1000 : 0;

      // Find active segment or nearest upcoming one
      let targetIndex = segments.findIndex(s => timeMs >= s.start && timeMs <= s.end);
      if (targetIndex === -1) {
        targetIndex = segments.findIndex(s => s.start > timeMs);
      }

      if (targetIndex !== -1) {
        // We need to wait a tick for the items to actually be in the DOM
        setTimeout(() => {
          const item = document.querySelector(`.lle-sidebar-item[data-index="${targetIndex}"]`);
          if (item && typeof item.scrollIntoView === 'function') {
            item.scrollIntoView({ behavior: 'auto', block: 'center' });
            hasInitiallyScrolled.current = true;
          }
        }, 0);
      }
    }
  }, [segments]);

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

  const handleTogglePauseOnHover = async () => {
    const current = await Config.getIsPauseOnHoverEnabled();
    await Config.setIsPauseOnHoverEnabled(!current);
  };

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" });
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
        onTogglePauseOnHover={handleTogglePauseOnHover}
        onOpenSettings={handleOpenSettings}
        overlayEnabled={config.isOverlayEnabled}
        aiEnabled={config.isGrammarEnabled}
        pauseOnHoverEnabled={config.isPauseOnHoverEnabled}
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
