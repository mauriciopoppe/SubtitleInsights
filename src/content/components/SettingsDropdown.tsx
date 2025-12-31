import { ComponentChildren, RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ComponentChildren;
  triggerRef?: RefObject<HTMLElement>;
}

export function SettingsDropdown({ isOpen, onClose, children, triggerRef }: SettingsDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // If we clicked the trigger button, let its own click handler handle it
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    // Use mousedown to be more responsive and avoid issues with text selection
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef} 
      className="lle-settings-dropdown"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {children}
    </div>
  );
}
