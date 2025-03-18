import "./globals.scss";

export const metadata = {
  title: "Disco - Influencer Marketing Platform",
  description:
    "Browse, analyze and connect with influencers across Instagram, Facebook, and YouTube.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
