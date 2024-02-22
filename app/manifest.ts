import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BARK Wallet - Dashboard',
    short_name: 'BARK Wallet',
    description: 'BARK Wallet is a secure and user-friendly wallet designed for managing BARK tokens on the Solana blockchain.',
    start_url: '/',
    scope: '/',
    lang: 'fr',
    display: 'fullscreen',
    display_override: ['window-controls-overlay'],
    orientation: 'portrait',
    background_color: '#03070E', // Updated background color
    theme_color: '#3D4556', // Updated theme color
    icons: [
      {
        src: '/favicon.ico',
        sizes: '128x128',
        type: 'image/x-icon',
      },
      {
        src: '/images/icons-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/images/icons-256.png',
        type: 'image/png',
        sizes: '256x256',
      },
      {
        src: '/images/icons-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  };
}

    ],
  };
}
