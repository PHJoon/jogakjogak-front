import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './Dropdown.module.css';

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

export const Dropdown = ({
  children,
  isOpen,
  setIsOpen,
  toggle,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef, isOpen, setIsOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      <div className={`${styles.dropdownContainer}`} ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
};

export const DropdownButton = ({ children }: { children: ReactNode }) => {
  const { toggle } = useDropdown();
  return (
    <button className={styles.dropdownButton} onClick={toggle}>
      {children}
    </button>
  );
};

export const DropdownMenu = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useDropdown();
  const [showDropdown, setShowDropdown] = useState(false);

  // fadeout을 위한 타이머
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setShowDropdown(true);
    } else {
      timeout = setTimeout(() => setShowDropdown(false), 200);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  return showDropdown ? (
    <div
      className={`${styles.dropdownMenu} ${isOpen ? styles.dropdownOpen : styles.dropdownClose}`}
    >
      {children}
    </div>
  ) : null;
};

export const DropdownItem = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  const { toggle } = useDropdown();

  const handleClick = () => {
    if (onClick) onClick();
    toggle();
  };

  return (
    <div className={styles.dropdownItem} onClick={handleClick}>
      {children}
    </div>
  );
};
