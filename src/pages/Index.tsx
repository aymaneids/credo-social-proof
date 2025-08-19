import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <SocialProof />
        <CTA />
      </main>
    </div>
  );
};

export default Index;
