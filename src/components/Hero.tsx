import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-testimonials.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background-gradient overflow-hidden">
      {/* Enhanced background with modern effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(220,70%,50%,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(160,60%,50%,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_20%,hsl(220,70%,50%,0.05)_40%,transparent_60%)]" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">Trusted by 2,000+ indie hackers</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                Build Social Proof 
                <span className="bg-hero-gradient bg-clip-text text-transparent block animate-fade-in">
                  With Zero Budget
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Credo automates collecting, managing, and displaying customer testimonials. 
                Get a shareable link for feedback and embed your <span className="text-foreground font-semibold">"Wall of Love"</span> in minutes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-10 py-7 shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105" onClick={() => navigate("/login")}>
                Start Collecting Testimonials →
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-10 py-7 border-2 hover:bg-muted/20 transition-all duration-300" onClick={() => navigate("/dashboard")}>
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