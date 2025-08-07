"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import styles from "./JogakModal.module.css";
import { JogakDetailModal } from "./JogakDetailModal";
import { Button } from "./Button";
import { TodoEditModal } from "./TodoEditModal";
import { extractDateTime } from '@/utils/extractDateTime';

interface JogakItem {
  id: string;
  text: string;
  completed: boolean;
  content?: string;
  fullTodo?: {
    checklist_id: number;
    category: string;
    title: string;
    content: string;
    memo: string;
    jdId: number;
    createdAt: string;
    updatedAt: string;
    done: boolean;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  items?: JogakItem[];
  icon?: StaticImageData;
  checkboxColor?: string;
  onItemToggle?: (itemId: string) => void;
  onItemEdit?: (itemId: string, data: { category: string; title: string; content: string }) => void;
  onItemDelete?: (itemId: string) => void;
  onItemAdd?: (data: { category: string; title: string; content: string }) => void;
  category?: string;
  categories?: { value: string; label: string }[];
  selectedItemId?: string | null;
}

export function JogakModal({
  isOpen,
  onClose,
  title = "필요한 경험과 역량",
  items = [],
  icon,
  checkboxColor = "#D9A9F9",
  onItemToggle,
  onItemEdit,
  onItemDelete,
  onItemAdd,
  category,
  categories = [],
  selectedItemId
}: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JogakItem | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // selectedItemId가 변경되면 해당 아이템 확장
  React.useEffect(() => {
    if (selectedItemId && isOpen) {
      setExpandedItemId(selectedItemId);
    }
  }, [selectedItemId, isOpen]);

  // 모달이 닫힐 때 확장 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setExpandedItemId(null);
    }
  }, [isOpen]);

  const handleItemToggleExpand = (itemId: string) => {
    // 같은 아이템을 클릭하면 닫기, 다른 아이템을 클릭하면 해당 아이템만 열기
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const handleEditClick = (item: JogakItem) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setEditModalOpen(true);
  };

  const handleEditModalSave = (data: { category: string; title: string; content: string }) => {
    if (editingItem) {
      onItemEdit?.(editingItem.id, data);
    } else {
      onItemAdd?.(data);
    }
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteClick = (item: JogakItem) => {
    if (confirm(`"${item.text}" 조각을 삭제하시겠습니까?`)) {
      onItemDelete?.(item.id);
    }
  };

  if (!isOpen) return null;

  const completedCount = items.filter(item => item.completed).length;
  const allCompleted = completedCount === items.length;

  return (
    <>
      {/* Modal backdrop */}
      <div className={styles.backdrop} onClick={onClose} />
      
      {/* Modal content */}
      <div className={styles.jogakModal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.headerLeft}>
              {icon && (
                <Image src={icon} alt={title} width={40} height={40} />
              )}
              <div className={styles.modalTitle}>{title}</div>
              {allCompleted && (
                <div className={styles.doneChip}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L4.5 8.5L2 6" stroke="var(--brandspec-pu400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className={styles.doneText}>완료</div>
                </div>
              )}
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M25 11L11 25M11 11L25 25" stroke="#94A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className={styles.itemsWrapper}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <JogakDetailModal
                  key={item.id}
                  state={item.completed ? "done" : "default"}
                  text={item.text}
                  description={item.content}
                  onClick={() => onItemToggle?.(item.id)}
                  checkboxColor={checkboxColor}
                  completedAt={item.completed && item.fullTodo ? extractDateTime(item.fullTodo.updatedAt) : undefined}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() => handleDeleteClick(item)}
                  isExpanded={expandedItemId === item.id}
                  onToggleExpand={() => handleItemToggleExpand(item.id)}
                />
              ))}
              <JogakDetailModal state="add-custom" onClick={handleAddClick} />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button
            variant="tertiary"
            onClick={onClose}
            className={styles.mainButton}
          >
            닫기
          </Button>
        </div>
      </div>

      <TodoEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleEditModalSave}
        initialData={editingItem ? {
          category: editingItem.fullTodo?.category || category || "",
          title: editingItem.text,
          content: editingItem.content || ""
        } : {
          category: category || "",
          title: "",
          content: ""
        }}
        categories={categories}
      />
    </>
  );
}