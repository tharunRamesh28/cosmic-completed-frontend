import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ReviewModalContextType {
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  reviewSubmittedCount: number;
  notifyReviewSubmitted: () => void;
}

const ReviewModalContext = createContext<ReviewModalContextType>({
  isReviewModalOpen: false,
  openReviewModal: () => {},
  closeReviewModal: () => {},
  reviewSubmittedCount: 0,
  notifyReviewSubmitted: () => {},
});

export const useReviewModal = () => useContext(ReviewModalContext);

interface ReviewModalProviderProps {
  children: ReactNode;
}

export const ReviewModalProvider: React.FC<ReviewModalProviderProps> = ({ children }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewSubmittedCount, setReviewSubmittedCount] = useState<number>(0);

  const openReviewModal = useCallback(() => {
    setIsReviewModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
  }, []);

  const notifyReviewSubmitted = useCallback(() => {
    setReviewSubmittedCount((prev) => prev + 1);
  }, []);

  return (
    <ReviewModalContext.Provider
      value={{
        isReviewModalOpen,
        openReviewModal,
        closeReviewModal,
        reviewSubmittedCount,
        notifyReviewSubmitted,
      }}
    >
      {children}
    </ReviewModalContext.Provider>
  );
};
