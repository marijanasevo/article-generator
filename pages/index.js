import Image from "next/image";
import HeroImage from "../public/hero.webp";
import { Logo } from "../components/logo/logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center relative items-start">
      <Image
        src={HeroImage}
        alt="Background image"
        fill
        className="absolute object-cover"
      />
      <div className="relative z-10 text-white px-10 max-w-screen-sm bg-emerald-900/90 flex-1 p-10 mt-8 rounded-[65px_0_65px_0] gap-6 flex flex-col mx-2.5">
        <div className="font-heading text-3xl text-center text-[#FADBAD]">
          Article Text Generator
        </div>
        <Logo size={100} />
        <p className="text-center">
          Discover the game-changing power of our AI-driven SAAS platform,
          designed to effortlessly generate
          <span className="text-[#FADBAD]"> SEO-optimized</span> articles within
          minutes. Unlock premium quality content without the need to sacrifice
          your valuable time.
        </p>
        <Link className="button" href="/article/new">
          Explore
        </Link>
      </div>
    </div>
  );
}
