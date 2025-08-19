const ProblemSolution = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            The Social Proof Paradox for New Founders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            You need testimonials to gain trust, but you need trust to get testimonials. 
            We break this cycle with radical simplicity.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Side */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-semibold mb-6 text-destructive">The Old Way (Painful)</h3>
            </div>
            
            <div className="space-y-6">
              {[
                "Manually email customers asking for testimonials",
                "Chase follow-ups and manage responses in chaos", 
                "Struggle with formatting and displaying reviews",
                "Waste hours on design and technical setup",
                "Pay expensive monthly fees for complex tools"
              ].map((problem, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-destructive text-sm font-bold">✕</span>
                  </div>
                  <p className="text-foreground">{problem}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Solution Side */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-semibold mb-6 text-accent">The Credo Way (Effortless)</h3>
            </div>
            
            <div className="space-y-6">
              {[
                "Get a shareable link that customers love using",
                "Automatic collection with zero follow-up needed",
                "Beautiful testimonials displayed instantly", 
                "Embed your Wall of Love with one line of code",
                "Free forever plan with everything you need"
              ].map((solution, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-accent text-sm font-bold">✓</span>
                  </div>
                  <p className="text-foreground">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;