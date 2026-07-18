import { useEffect, useRef } from 'react';
import profilePhoto from '../assets/profile.jpeg';

export default function HeroPortrait() {
  const frameRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const y = window.scrollY;
      const shift = Math.min(y * 0.28, 100);
      frame.style.transform = `translate3d(${shift * 0.35}px, ${shift * 0.1}px, 0) scale(${1 + Math.min(y * 0.00012, 0.05)})`;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="hero-portrait-wrap">
      <div className="hero-portrait-frame" ref={frameRef}>
        <img src={profilePhoto} alt="Muhammad Rohail" className="hero-portrait-img" />
      </div>
    </div>
  );
}
