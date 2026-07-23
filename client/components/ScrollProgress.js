'use client';

import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-vision"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
