import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, Video, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Collect = () => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !testimonial) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      toast({
        title: "Thank you for your testimonial!",
        description: "Your feedback has been submitted successfully.",
      });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background-gradient flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your testimonial has been submitted successfully. The team will review it shortly.
            </p>
            <Button onClick={() => window.close()} variant="outline">
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-gradient p-6">
      <div className="container mx-auto max-w-2xl py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">C</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Credo</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Share Your Experience</h1>
          <p className="text-xl text-muted-foreground">
            Help other founders by sharing your experience with <strong>TaskFlow</strong>
          </p>
        </div>

        {/* Testimonial Form */}
        <Card>
          <CardHeader>
            <CardTitle>Leave a Testimonial</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  How would you rate your experience? *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name *
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Testimonial */}
              <div>
                <label htmlFor="testimonial" className="block text-sm font-medium mb-2">
                  Your Testimonial *
                </label>
                <Textarea
                  id="testimonial"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Tell us about your experience. What problem did TaskFlow solve for you? How has it helped your business?"
                  className="min-h-32"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be specific about the results and benefits you experienced
                </p>
              </div>

              {/* Optional Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload photo
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video Testimonial (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Record or upload video
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg">
                  Submit Testimonial
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your testimonial will be reviewed before being published
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Join 2,000+ founders who trust Credo for social proof
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>🔒 Secure & Private</span>
            <span>⚡ Takes 2 minutes</span>
            <span>🎯 No account required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collect;