import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-hero-gradient">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Build Unstoppable Social Proof?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join 2,000+ indie hackers who've transformed their credibility with Credo. 
            Start collecting testimonials in under 2 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-12 py-6 bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/login")}
            >
              Start Free Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-12 py-6 border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/dashboard")}
            >
              Watch 2-Min Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-primary-foreground/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Free Forever Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;