const SocialProof = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Indie Hacker",
      company: "TaskFlow",
      content: "Credo transformed how I collect testimonials. What used to take me hours now happens automatically. My conversion rate improved by 40% after adding the Wall of Love!",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      role: "Solo Developer",
      company: "CodeSnap",
      content: "As a bootstrapper, every dollar counts. Credo's free plan gave me enterprise-level social proof without the enterprise price tag. Absolutely game-changing.",
      avatar: "MR",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "No-Code Maker", 
      company: "FlowBuilder",
      content: "I was skeptical about another testimonial tool, but Credo's simplicity won me over. Setup took 2 minutes, and I had my first testimonial within an hour!",
      avatar: "EW", 
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Loved by Indie Hackers Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of makers who've transformed their social proof with Credo
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-accent text-xl">★</span>
                ))}
              </div>
              
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-hero-gradient rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-12 text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">2,000+</div>
              <div className="text-sm">Happy Makers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">50,000+</div>
              <div className="text-sm">Testimonials Collected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;