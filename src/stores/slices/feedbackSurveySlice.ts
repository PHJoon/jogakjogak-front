import { StateCreator } from 'zustand';

export interface FeedbackSurveySlice {
  showFeedbackSurveyModal: boolean;
  jdCount: number;
  setShowFeedbackSurveyModal: (show: boolean) => void;
  setJdCount: (count: number) => void;
  openFeedbackSurveyModal: () => void;
  closeFeedbackSurveyModal: () => void;
  canShowFeedbackSurvey: () => boolean;
}

export const createFeedbackSurveySlice: StateCreator<
  FeedbackSurveySlice,
  [],
  [],
  FeedbackSurveySlice
> = (set, get): FeedbackSurveySlice => ({
  showFeedbackSurveyModal: false,
  jdCount: 0,
  setShowFeedbackSurveyModal: (show) =>
    set((state) => ({ showFeedbackSurveyModal: show })),
  setJdCount: (count) => set((state) => ({ jdCount: count })),
  openFeedbackSurveyModal: () => {
    const state = get();
    if (state.canShowFeedbackSurvey()) {
      set({ showFeedbackSurveyModal: true });
    }
  },
  closeFeedbackSurveyModal: () =>
    set(() => ({ showFeedbackSurveyModal: false })),
  canShowFeedbackSurvey: () => {
    const { jdCount } = get();
    return jdCount === 1;
  },
});
