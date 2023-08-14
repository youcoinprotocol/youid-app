import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "@/redux/provider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "YOU COIN",
  description: "YOU is better than WorldCoin",
  openGraph: {
    title: "YOU COIN",
    description: "YOU is better than WorldCoin",
    locale: "en_US",
    type: "website",
    url: "https://youcoin.org/",
    siteName: "YOU COIN",
    images: "/assets/logo.png",
    image: "https://www.youcoin.org/assets/logo.png",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
