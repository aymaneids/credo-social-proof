import { Button } from "@/components/ui/button";

const Features = () => {
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
    <section className="py-20 bg-background-gradient">
      <div className="container mx-auto px-6">
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg px-12 py-6">
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