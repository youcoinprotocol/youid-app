import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "@/redux/provider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "YOU ID",
  description: "YOU is better than WorldCoin",
  metadataBase: new URL("https://id.youcoin.org/"),
  openGraph: {
    title: "YOU ID",
    description: "YOU is better than WorldCoin",
    locale: "en_US",
    type: "website",
    url: "https://id.youcoin.org/",
    siteName: "YOU ID",
    images: "/assets/logo.png",
    image: "https://id.youcoin.org/assets/logo.png",
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
