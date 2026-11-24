import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'คลินิกทันตกรรมหมอมิน หมอพรีม | Min & Preem Dental Clinic',
  description: 'เว็บแอปพลิเคชันบริหารงานคลินิกทันตกรรมหมอมิน หมอพรีม ครบวงจร',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
