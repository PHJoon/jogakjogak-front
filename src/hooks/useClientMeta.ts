'use client';

import { useEffect } from 'react';

export default function useClientMeta(title?: string, description?: string) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );
      if (tag) {
        tag.setAttribute('content', description);
      } else {
        const newTag = document.createElement('meta');
        newTag.name = 'description';
        newTag.content = description;
        document.head.appendChild(newTag);
      }
    }
  }, [title, description]);
}
