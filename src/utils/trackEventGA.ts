import { sendGTMEvent } from '@next/third-parties/google';

type GTagEvent = {
  event: string;
  category: string;
  method?: string;
  status?: boolean;
  jobId?: number;
};

export default function trackEvent(params: GTagEvent) {
  sendGTMEvent(params);
}
