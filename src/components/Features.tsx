import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: "🔗",
      title: "Shareable Collection Link",
      description: "Get a beautiful, branded page where customers can easily leave testimonials. No accounts or complex forms required."
    },
    {
      icon: "⚡",
      title: "Instant Wall of Love",
      description: "Display testimonials on your website with a simple embed code. Updates automatically as new reviews come in."
    },
    {
      icon: "🎨",
      title: "Beautiful Design System",
      description: "Choose from professionally designed themes that match your brand. No design skills needed."
    },
    {
      icon: "📱",
      title: "Mobile-First Experience",
      description: "Optimized for mobile customers who prefer leaving reviews on their phones. Higher response rates guaranteed."
    },
    {
      icon: "🔒",
      title: "Built-in Moderation",
      description: "Review testimonials before they go live. Control your brand reputation with smart filtering tools."
    },
    {
      icon: "💰",
      title: "Zero Budget Friendly",
      description: "Generous free tier designed for bootstrappers. Upgrade only when you're making money."
    }
  ];

  return (
    <section className="py-24 bg-background-gradient relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(220,70%,50%,0.03),transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to Build
            <span className="bg-hero-gradient bg-clip-text text-transparent block">
              Unstoppable Social Proof
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Designed specifically for indie hackers who need to move fast and build trust quickly.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Card with enhanced effects */}
              <div className="p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/40 shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg px-12 py-6" onClick={() => navigate("/login")}>
            Start Building Social Proof Today
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join 2,000+ indie hackers who trust Credo with their social proof
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;