import { useState } from 'react';

export default function useResumeModal() {
  const [isResumeErrorModalOpen, setIsResumeErrorModalOpen] = useState(false);
  const [isBackConfirmModalOpen, setBackConfirmModalOpen] = useState(false);

  const [resumeErrorMessage, setResumeErrorMessage] = useState({
    modalTitle: '',
    modalContent: '',
  });

  const showResumeErrorModal = (title: string, content: string) => {
    setResumeErrorMessage({ modalTitle: title, modalContent: content });
    setIsResumeErrorModalOpen(true);
  };

  const closeResumeErrorModal = () => {
    setIsResumeErrorModalOpen(false);
  };

  const showBackConfirmModal = () => {
    setBackConfirmModalOpen(true);
  };

  const closeBackConfirmModal = () => {
    setBackConfirmModalOpen(false);
  };

  return {
    isResumeErrorModalOpen,
    isBackConfirmModalOpen,
    resumeErrorMessage,
    showResumeErrorModal,
    closeResumeErrorModal,
    showBackConfirmModal,
    closeBackConfirmModal,
  };
}
