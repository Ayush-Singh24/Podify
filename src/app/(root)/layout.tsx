import LeftSidebar from "@/components/LeftSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main className="bg-black-3">
        <LeftSidebar />
        {children}
        <p>Right sidebar</p>
      </main>
    </div>
  );
}
