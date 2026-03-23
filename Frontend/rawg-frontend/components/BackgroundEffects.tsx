'use client';
import { div } from "motion/react-client";
import Particles from "./Particles";
import { usePathname } from "next/navigation";

export default function BackgroundEffects() {
    const pathname = usePathname();
    if (pathname === "/") {
        return null;
    }
    
    return (
        <div className="fixed inset-0 -z-10 w-full h-full">
            <Particles
            particleColors={["#00FFFF"]}
            particleCount={500}
            particleSpread={10}
            speed={0.2}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={true}
            disableRotation={true}
            pixelRatio={1}
          />
        </div>
    )
}