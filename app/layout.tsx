import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import CosmicScene from './components/CosmicScene';
import { CartProvider } from '@/app/context/CartContext';
import { AuthProvider } from '@/app/context/AuthContext';
import { AdminAuthProvider } from '@/app/context/AdminAuthContext';
import Navbar from '@/app/components/Navbar';
import SiteFooter from '@/app/components/SiteFooter';
import CartDrawer from '@/app/components/CartDrawer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cosmic Kicks - Step Beyond the Horizon',
  description: 'Premium footwear forged for the cosmos.',
  openGraph: { title: 'Cosmic Kicks', description: 'Premium footwear forged for the cosmos.' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative flex min-h-full flex-col font-sans bg-[#050508] text-[#ededed]">
        <CosmicScene />
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <SiteFooter />
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
