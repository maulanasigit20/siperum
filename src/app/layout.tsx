import "./globals.css";

export const metadata = {
  title: "Kas Perumahan",
  description: "Aplikasi kas perumahan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}