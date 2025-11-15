import { useState, useEffect, useRef, useCallback } from 'react';

interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizationResult<T> {
  virtualItems: T[];
  totalHeight: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualization<T>(
  items: T[],
  config: VirtualizationConfig
): VirtualizationResult<T> {
  const { itemHeight, containerHeight, overscan = 3 } = config;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    virtualItems,
    totalHeight,
    offsetY,
    containerRef,
  };
}
