import Link from "next/link";
import Image from "next/image";

function Header() {
  // const router = useRouter();
  return (
    <div className="flex flex-row justify-between min-h-[12vh] items-center px-7 py-5 font-mono">
      <div className="hidden md:flex ">
        <Image src={"/gces_logo.png"} width={100} height={100} alt="gces" />
      </div>
      <div className=" flex flex-col justify-center">
        <Link
          href={"/"}
          className="font-bold text-xl tracking-wide md:text-2xl  "
        >
          Government College of Engineering Srirangam,Trichy-620012
        </Link>
        <br />
        <h4 className="font-semibold text-lg uppercase">
          Student Verification System
        </h4>
      </div>
      <Link
        className="bg-green-400 px-2 md:py-3 md:px-5 py-1 rounded-md"
        href={"/login"}
      >
        Admin Login
      </Link>
    </div>
  );
}

export default Header;
