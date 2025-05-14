import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full flex items-center justify-center p-4 max-h-20">
      <Link href={"/"}>
        <Image
          src={"/brand/logo-transparent.png"}
          alt="Matchita Log"
          width={150}
          height={30}
          className=""
          priority={false}
        />
      </Link>
    </div>
  );
};

export default Header;
