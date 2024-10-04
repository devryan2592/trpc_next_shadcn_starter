import "@repo/ui/globals.css";
import { ThemeProvider } from "@repo/ui/providers/ThemeProvider";
import { TRPCProvider } from "../trpc/client";
import { Toaster } from "@repo/ui/components/base/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <TRPCProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors closeButton />
            </ThemeProvider>
          </TRPCProvider>
        </body>
      </html>
    </>
  );
}
