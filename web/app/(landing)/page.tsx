import PawPrintBackground from "@/components/landing/PawPrintBackground";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FeaturedListingsSection from "@/components/landing/FeaturedListingsSection";
import LandingFooter from "@/components/landing/LandingFooter";
import SpotlightCatSection from "@/components/landing/SpotlightCatSection";
import CTASection from "@/components/landing/CTASection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-svh w-full bg-cloud-white relative overflow-hidden">
      <PawPrintBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SpotlightCatSection />
      <FeaturedListingsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
