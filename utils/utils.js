import { useEffect, useRef } from 'react';

/**
 * Transform menu items data into sections for SectionList
 */
export const getSectionListData = (data) => {
  const sections = {};
  
  data.forEach(item => {
    const category = item.category || 'other';
    if (!sections[category]) {
      sections[category] = {
        title: category.charAt(0).toUpperCase() + category.slice(1),
        data: []
      };
    }
    sections[category].data.push(item);
  });
  
  return Object.values(sections);
};

/**
 * Custom hook that runs effect only on updates, not on mount
 */
export const useUpdateEffect = (callback, dependencies) => {
  const firstRenderRef = useRef(true);
  
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
