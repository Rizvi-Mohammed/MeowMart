import Navbar from "@/components/Navbar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className="bg-cloud-white flex-1 min-h-[calc(100svh-80px)] mt-20">
        {children}
      </main>
    </>
  );
};
export default MainLayout;
