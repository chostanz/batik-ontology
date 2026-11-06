import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Batik Nusantara - Web Semantik & Ontologi',
  description: 'GUI Web Semantik Temu Kembali Pengetahuan Batik Nusantara Berbasis Ontologi OWL dengan Penalaran Sinonim',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
