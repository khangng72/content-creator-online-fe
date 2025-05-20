import { Toaster } from '@/components/ui/toaster';

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <nav className="w-full bg-card fixed py-3 px-4 flex items-center justify-center gap-3">
        <button className="bg-accent w-[200px] py-2 rounded-md hover:opacity-90">
          Chapter Reports
        </button>

        <button className="bg-accent w-[200px] py-2 rounded-md hover:opacity-90">
          User Reports
        </button>
      </nav>
      <main>{children}</main>
      <Toaster />
    </>
  );
};

export default AdminLayout;
