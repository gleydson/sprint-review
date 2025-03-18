import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ActiveThemeProvider } from '@/components/active-theme';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sprint Review',
    template: '%s | Sprint Review',
  },
  description: 'A dashboard to help you track your sprints.',
  metadataBase: new URL('https://sprint-review.vercel.app/'),
  keywords: [
    'sprint',
    'review',
    'dashboard',
    'jira',
    'agile',
    'scrum',
    'kanban',
    'project',
    'management',
    'tracking',
  ],
  authors: [
    {
      name: 'Gleydson Rodrigues',
      url: 'https://github.com/gleydson',
    },
  ],
  creator: 'Gleydson Rodrigues',
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
        )}
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ActiveThemeProvider initialTheme={activeThemeValue}>
              {children}
              <Toaster />
            </ActiveThemeProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
