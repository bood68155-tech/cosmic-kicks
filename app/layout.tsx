import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StarField from './components/StarField';
import { CartProvider } from '@/app/context/CartContext';
import CartDrawer from '@/app/components/CartDrawer';
import CartIcon from '@/app/components/CartIcon';
import Link from 'next/link';

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
      <body className="relative flex min-h-full flex-col font-sans bg-[#050508] text-[#ededed]">
        <StarField />
        <CartProvider>
          <header className="glass-nav sticky top-0 z-50">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
              <Link href="/" className="group flex items-center gap-2.5">
                <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] text-lg transition-all group-hover:border-white/[0.15] group-hover:shadow-[0_0_12px_rgba(255,255,255,0.06)]">
                  <span className="relative z-10">+</span>
                </span>
                <span className="font-heading text-sm font-semibold tracking-wide text-white/80 transition-colors group-hover:text-white/90">Cosmic Kicks</span>
              </Link>
              <nav className="hidden items-center gap-8 sm:flex">
                {[{ label: 'Sneakers', href: '/#sneakers' }, { label: 'Classics', href: '/#classics' }, { label: 'Boots', href: '/#boots' }].map((item) => (
                  <Link key={item.label} href={item.href} className="relative text-xs font-medium tracking-widest uppercase text-white/40 transition-colors hover:text-white/70 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-white/30 after:transition-all after:duration-300 hover:after:w-full">{item.label}</Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="hidden rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white/40 transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/60 sm:inline-flex">Admin</Link>
                <CartIcon />
              </div>
            </div>
          </header>
          <nav className="glass-nav--solid flex items-center justify-center gap-6 py-3 sm:hidden">
            {['Sneakers', 'Classics', 'Boots'].map((item) => (
              <Link key={item} href={'/#' + item.toLowerCase()} className="text-[11px] font-medium tracking-widest uppercase text-white/40 transition-colors hover:text-white/70">{item}</Link>
            ))}
          </nav>
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <footer className="relative border-t border-white/[0.04] bg-black/30 py-12 overflow-hidden">
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-900/5 blur-[80px]" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-900/5 blur-[80px]" />
            <div className="mx-auto relative max-w-6xl px-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading text-sm font-semibold tracking-wide text-white/60">Cosmic Kicks</span>
                </div>
                <div className="flex items-center gap-6">
                  {['Sneakers', 'Classics', 'Boots'].map((item) => (
                    <Link key={item} href={'/#' + item.toLowerCase()} className="text-[11px] font-medium uppercase tracking-widest text-white/30 transition-colors hover:text-white/50">{item}</Link>
                  ))}
                  <Link href="/admin" className="text-[11px] font-medium uppercase tracking-widest text-white/20 transition-colors hover:text-white/40">Admin</Link>
                </div>
                <p className="text-xs text-white/40">Designed on Earth. Inspired by the stars. © 2026</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
