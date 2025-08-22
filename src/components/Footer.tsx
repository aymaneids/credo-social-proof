import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Wall of Love", href: "#" }
    ],
    Company: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" }
    ],
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "API", href: "#" },
      { name: "Status", href: "#" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" }
    ]
  };

  return (
    <footer className="relative bg-background border-t border-border/40">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/80" />
      
      <div className="relative container mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid lg:grid-cols-6 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-hero-gradient rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Credo</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Build unstoppable social proof with zero budget. Automate testimonial collection 
              and create beautiful walls of love that convert visitors into customers.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="hero" size="sm" className="px-6">
                Start Free Today
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">2,000+ founders trust us</span>
              </div>
            </div>
          </div>
          
          {/* Links sections */}
          <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter section */}
        <div className="border-t border-border/40 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Stay in the loop</h3>
              <p className="text-muted-foreground">
                Get the latest updates on new features, integrations, and growth tips for indie hackers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <Button variant="hero" className="px-6 py-3">
                Subscribe
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 Credo. All rights reserved.</span>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                <span>by indie hackers, for indie hackers</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Social links */}
              <div className="flex items-center gap-3">
                {['Twitter', 'GitHub', 'Discord'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                    aria-label={platform}
                  >
                    <span className="text-xs font-medium">{platform[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;