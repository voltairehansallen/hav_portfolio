import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import StatusBar from '../components/layout/StatusBar';
import Footer from '../components/layout/Footer';
import ChatWidget from '../components/chat/ChatWidget';
import { LanguageProvider } from '../lib/LanguageContext';
import MotionProvider from '../components/MotionProvider';
import ScrollProgress from '../components/ScrollProgress';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_URL = /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`;

function safeUrl(value, fallback) {
  try {
    return new URL(value);
  } catch {
    console.warn(`⚠️  "${value}" n'est pas une URL valide — repli sur ${fallback}.`);
    return new URL(fallback);
  }
}

export const metadata = {
  metadataBase: safeUrl(SITE_URL, 'http://localhost:3000'),
  title: {
    default: 'HAV OS — Portfolio',
    template: '%s — HAV OS',
  },
  description: 'Humility. Ambition. Vision. Portfolio personnel.',
  openGraph: {
    type: 'website',
    siteName: 'HAV OS',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport = {
  themeColor: '#0A0E14',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <MotionProvider>
          <LanguageProvider>
            <ScrollProgress />
            <StatusBar />
            {children}
            <Footer />
            <ChatWidget />
          </LanguageProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
