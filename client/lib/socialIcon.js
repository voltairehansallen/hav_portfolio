import { Github, Linkedin, Twitter, Instagram, Mail, MessageCircle, BarChart3, Globe } from 'lucide-react';

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  email: Mail,
  kaggle: BarChart3, // pas de logo Kaggle dans Lucide — icône graphique en approximation
  whatsapp: MessageCircle, // idem, pas de logo WhatsApp officiel disponible
};

export function socialIcon(platform) {
  return ICONS[platform?.toLowerCase()] || Globe;
}
