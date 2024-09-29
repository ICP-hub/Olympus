import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useFadeInScrollAnimation = (ref, startOffset, endOffset) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: `top+=${startOffset} center`,
        end: `bottom+=${endOffset} center`,
        toggleActions: 'restart none none none',
        markers: false,
      },
      opacity: 0,
      y: 35,
      duration: 2,
      ease: 'power3.out',
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) {
          st.kill();
        }
      });
    };
  }, [ref, startOffset, endOffset]);
};

export default useFadeInScrollAnimation;
