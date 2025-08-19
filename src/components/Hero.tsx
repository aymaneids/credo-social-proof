import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-testimonials.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(220,70%,50%,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(160,60%,50%,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Build Social Proof 
                <span className="bg-hero-gradient bg-clip-text text-transparent block">
                  With Zero Budget
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Credo automates collecting, managing, and displaying customer testimonials. 
                Get a shareable link for feedback and embed your "Wall of Love" in minutes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/login")}>
                Start Collecting Testimonials
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/dashboard")}>
                See Live Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Free Forever Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Setup in 2 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>No Credit Card</span>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Customer testimonials dashboard showing social proof collection"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating testimonial cards */}
            <div className="absolute -top-4 -left-4 bg-card p-4 rounded-xl shadow-medium max-w-xs animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-accent rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-accent rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;