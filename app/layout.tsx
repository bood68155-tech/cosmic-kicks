import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StarField from './components/StarField';
import { CartProvider } from '@/app/context/CartContext';
import CartDrawer from '@/app/components/CartDrawer';
import CartIcon from '@/app/components/CartIcon';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cosmic Kicks — Step Beyond the Horizon',
  description:
    'Premium footwear forged for the cosmos. Explore our collections of sneakers, classics, and boots — designed on Earth, inspired by the stars.',
  openGraph: {
    title: 'Cosmic Kicks',
    description: 'Premium footwear forged for the cosmos.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <StarField />

        <CartProvider>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-black/60 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] text-lg transition-all group-hover:border-white/[0.15] group-hover:shadow-[0_0_12px_rgba(255,255,255,0.06)]">
                <span className="relative z-10">🚀</span>
                <span className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-white/80 transition-colors group-hover:text-white/90">
                Cosmic Kicks
              </span>
            </a>

            {/* Navigation */}
            <nav className="hidden items-center gap-8 sm:flex">
              {['Sneakers', 'Classics', 'Boots'].map((item) => (
                <a
                  key={item}
                  href={`/#${item.toLowerCase()}`}
                  className="relative text-xs font-medium tracking-widest uppercase text-white/40 transition-colors hover:text-white/70 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-white/30 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </a>
              ))}
              <a
                href="/admin"
                className="relative text-xs font-medium tracking-widest uppercase text-purple-400/60 transition-colors hover:text-purple-400 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-purple-500/40 after:transition-all after:duration-300 hover:after:w-full"
              >
                Admin
              </a>
            </nav>

            {/* Cart icon */}
            <CartIcon />
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex items-center justify-center gap-6 border-b border-white/[0.04] bg-black/30 py-3 sm:hidden">
          {['Sneakers', 'Classics', 'Boots'].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="text-[11px] font-medium tracking-widest uppercase text-white/40 transition-colors hover:text-white/70"
            >
              {item}
            </a>
          ))}
          <a
            href="/admin"
            className="text-[11px] font-medium tracking-widest uppercase text-purple-400/60 transition-colors hover:text-purple-400"
          >
            Admin
          </a>
        </nav>

        <main className="flex-1">{children}</main>

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Footer */}
        <footer className="relative border-t border-white/[0.04] bg-black/30 py-10 overflow-hidden">
          {/* Subtle cosmic glow in footer */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-900/5 blur-[80px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-900/5 blur-[80px]" />
          <div className="mx-auto relative max-w-6xl px-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🚀</span>
                <span className="text-sm font-semibold tracking-wide text-white/60">
                  Cosmic Kicks
                </span>
              </div>
              <p className="text-xs text-white/30">
                Designed on Earth. Inspired by the stars. &copy; 2026
              </p>
            </div>
          </div>
        </footer>

        </CartProvider>
      </body>
    </html>
  );
}
