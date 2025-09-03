import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import dropdownIcon from '@/assets/images/ic_drop_down.svg';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@/components/common/Dropdown';
import { ShowOnly, Sort } from '@/types/jds';

import styles from './SortDropdown.module.css';

type Option = {
  label: string;
  value: string;
  type: 'sort' | 'showOnly';
};

interface Props {
  setSort: (
    newSort: Sort,
    opts?: { resetPage: boolean; push?: boolean; scroll?: boolean }
  ) => void;
  setShowOnly: (
    newShowOnly: ShowOnly,
    opts?: { resetPage: boolean; push?: boolean; scroll?: boolean }
  ) => void;
}

export default function SortDropdown({ setSort, setShowOnly }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const params = useSearchParams();
  const paramsOption =
    params.get('sort') || params.get('showOnly') || 'createdAt,desc';
  const [optionLabel, setOptionLabel] = useState(paramsOption);

  const handleClick = (option: Option) => {
    setOptionLabel(option.label);
    if (option.type === 'sort') {
      setSort(option.value as Sort, { resetPage: true });
    }
    if (option.type === 'showOnly') {
      setShowOnly(option.value as ShowOnly, { resetPage: true });
    }
  };

  const sortOptions: Option[] = [
    {
      label: '최신순',
      value: 'createdAt,desc',
      type: 'sort',
    },
    {
      label: '오래된 순',
      value: 'createdAt,asc',
      type: 'sort',
    },
    {
      label: 'D-day 순',
      value: 'endedAt,asc',
      type: 'sort',
    },
    {
      label: '즐겨찾기 순',
      value: 'bookmark',
      type: 'showOnly',
    },
    {
      label: '지원 완료',
      value: 'completed',
      type: 'showOnly',
    },
    {
      label: '알림 ON',
      value: 'alarm',
      type: 'showOnly',
    },
  ];

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} toggle={toggle}>
      <DropdownButton>
        <div className={`${styles.sortButton} ${isOpen ? styles.open : ''}`}>
          <div className={styles.sortButtonText}>
            {sortOptions.find((opt) => opt.value === optionLabel)?.label}
          </div>
          <Image
            src={dropdownIcon}
            alt="Dropdown Icon"
            width={16}
            height={16}
            className={`${styles.dropdownIcon} ${isOpen ? styles.open : ''}`}
          />
        </div>
      </DropdownButton>
      <DropdownMenu>
        <div className={styles.dropdownMenu}>
          {sortOptions.map((opt) => {
            if (opt.value === optionLabel) return null;
            return (
              <button
                className={styles.sortSelect}
                key={opt.value}
                onClick={() => handleClick(opt)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
