export default function manifest() {
  return {
    name: 'HAV OS — Portfolio',
    short_name: 'HAV OS',
    description: 'Humility. Ambition. Vision. — Portfolio personnel.',
    start_url: '/',
    display: 'standalone',
    background_color: '#24292E',
    theme_color: '#24292E',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
