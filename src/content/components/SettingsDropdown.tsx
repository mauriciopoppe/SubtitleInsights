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
      
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef} 
      className="si-settings-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

interface SettingsItemProps {
  label: string;
  icon?: ComponentChildren;
  onClick?: () => void;
  status?: 'enabled' | 'disabled' | 'indeterminate';
  title?: string;
  isNested?: boolean;
  style?: any;
}

export function SettingsItem({ label, icon, onClick, status, title, isNested, style }: SettingsItemProps) {
  const className = `si-settings-dropdown-item ${status || ''} ${isNested ? 'nested' : ''}`;
  
  return (
    <div 
      className={className}
      title={title}
      onClick={onClick}
      style={style}
    >
      {icon && <span className="si-settings-item-icon">{icon}</span>}
      <span className="si-settings-item-label">{label}</span>
      {status !== undefined && (
        <div className={`si-toggle-switch ${status}`}></div>
      )}
    </div>
  );
}
