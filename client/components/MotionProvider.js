'use client';

import { MotionConfig } from 'framer-motion';

export default function MotionProvider({ children }) {
  // reducedMotion="user" fait respecter automatiquement le réglage système
  // par TOUS les composants motion.* de l'app, sans avoir à le gérer un par un.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
