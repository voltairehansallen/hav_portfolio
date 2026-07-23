export default function manifest() {
  return {
    name: 'HAV OS — Portfolio',
    short_name: 'HAV OS',
    description: 'Humility. Ambition. Vision. — Portfolio personnel.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0E14',
    theme_color: '#0A0E14',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
