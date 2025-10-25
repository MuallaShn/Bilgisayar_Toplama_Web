import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PC Toplama",
    description: "React ile PC parça uyumluluk kontrolü",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
        <body>{children}</body>
        </html>
    );
}
