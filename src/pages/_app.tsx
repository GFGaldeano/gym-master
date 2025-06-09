import type { AppProps } from "next/app";
import "@/app/globals.css"; // importa Tailwind + variables
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/services/supabaseClient";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <style jsx global>{`
          :root {
            --font-geist-sans: ${geistSans.style.fontFamily};
            --font-geist-mono: ${geistMono.style.fontFamily};
          }
          html {
            font-family: var(--font-geist-sans), sans-serif;
          }
        `}</style>
      </Head>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
          >
            <SidebarProvider>
              <Component {...pageProps} />
              <Toaster position="top-right" richColors />
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </SessionContextProvider>
    </>
  );
}
