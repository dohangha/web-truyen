import { useEffect, useRef, useState } from 'react';

export default function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Chỉ chạy animation 1 lần, sau đó ngừng theo dõi để tiết kiệm hiệu năng
        observer.unobserve(node);
      }
    }, options ?? { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
