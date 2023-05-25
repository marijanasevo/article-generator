import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LogoSVG from "../../public/logo.svg";

export const Logo = () => {
  return (
    <div className="block text-2xl py-4 flex w-screen justify-center">
      <Image src={LogoSVG} alt={"Logo image"} height={50} />
    </div>
  );
};
