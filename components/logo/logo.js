import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LogoSVG from "../../public/logo.svg";

export const Logo = ({ size = 50 }) => {
  return (
    <div className="py-4 flex justify-center">
      <Image src={LogoSVG} alt={"Logo image"} height={size} />
    </div>
  );
};
