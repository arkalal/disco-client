import "./globals.scss";
import { Toaster } from "react-hot-toast";
import SessionProvider from "../../components/SessionProvider";

export const metadata = {
  title: "Disco - Influencer Marketing Platform",
  description:
    "Browse, analyze and connect with influencers across Instagram, Facebook, and YouTube.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Toaster position="top-center" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
