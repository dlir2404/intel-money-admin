import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import '@ant-design/v5-patch-for-react-19';
import { ReactQueryProviders } from '@/providers/reactquery';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <ReactQueryProviders>
              <SidebarProvider>{children}</SidebarProvider>
            </ReactQueryProviders>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
