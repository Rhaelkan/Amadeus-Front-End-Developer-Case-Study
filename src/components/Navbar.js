import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="fixed top-0 backdrop-blur-xl w-full z-20">
      <div className="max-w-7xl w-full flex justify-between items-center py-8 px-6 mx-auto">
        <Image src="/amadeus_logo.jpeg" width={120} height={120} />
        <div className="uppercase leading-3 tracking-tighter font-semibold">
          <h1 className="text-[14px]">travel to</h1>
          <h1 className="text-[20px]">
            <span className="text-amber-500">future</span>program
          </h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
