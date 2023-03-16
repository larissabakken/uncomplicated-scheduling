import "../lib/dayjs";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { globalStyles } from "../styles/global";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import { DefaultSeo } from "next-seo";

/**
 * Applies global styles to the application
 */
globalStyles();

/**
 * Wraps the Next.js app and provides global providers and configuration
 * @param {AppProps} props - The app component's props
 * @returns {JSX.Element} - The app component's JSX elements
 */
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    // Provide a React Query client for data fetching
    <QueryClientProvider client={queryClient}>
      {/* Provide the authentication session to child components */}
      <SessionProvider session={session}>
        {/* Set default Open Graph metadata for social sharing */}
        <DefaultSeo
          openGraph={{
            type: "website",
            locale: "pt_BR",
            url: "https://uncomplicated-scheduling.vercel.app/",
            siteName: "Uncomplicated Scheduling",
          }}
        />

        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
