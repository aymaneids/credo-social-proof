import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Link, Code, Eye, Check, X, Star, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo
const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@taskflow.com",
    testimonial: "Credo transformed how I collect testimonials. What used to take me hours now happens automatically. My conversion rate improved by 40%!",
    status: "pending",
    createdAt: "2024-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    hasPhoto: true,
    hasVideo: false
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    email: "marcus@codesnap.dev",
    testimonial: "As a bootstrapper, every dollar counts. Credo's free plan gave me enterprise-level social proof without the enterprise price tag.",
    status: "approved",
    createdAt: "2024-01-14",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    rating: 5,
    hasPhoto: true,
    hasVideo: true
  },
  {
    id: 3,
    name: "Emily Watson",
    email: "emily@flowbuilder.io",
    testimonial: "Setup took 2 minutes, and I had my first testimonial within an hour! The Wall of Love looks amazing on my site.",
    status: "approved",
    createdAt: "2024-01-13",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
    hasPhoto: false,
    hasVideo: false
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@startuptools.com",
    testimonial: "The embeddable widget is exactly what I needed. Clean, responsive, and it matches my brand perfectly.",
    status: "pending",
    createdAt: "2024-01-12",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 4,
    hasPhoto: true,
    hasVideo: false
  }
];

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const collectionUrl = "https://credo.so/your-startup";
  const embedCode = `<script src="https://widget.credo.so/wall-of-love.js" data-product="your-startup"></script>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const updateTestimonialStatus = (id: number, status: "approved" | "hidden") => {
    setTestimonials(prev => 
      prev.map(t => t.id === id ? { ...t, status } : t)
    );
    toast({
      title: status === "approved" ? "Testimonial Approved!" : "Testimonial Hidden",
      description: status === "approved" 
        ? "This testimonial will now appear in your Wall of Love" 
        : "This testimonial has been archived",
    });
  };

  const pendingCount = testimonials.filter(t => t.status === "pending").length;
  const approvedCount = testimonials.filter(t => t.status === "approved").length;
  const totalCount = testimonials.length;

  return (
    <div className="min-h-screen bg-background-gradient">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-foreground">Credo</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                Hacker Plan (Free)
              </Badge>
              <Button variant="outline" size="sm">
                Upgrade to Founder
              </Button>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground">Here's how your social proof is performing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-sm text-muted-foreground">Total Testimonials</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.2k</p>
                  <p className="text-sm text-muted-foreground">Widget Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {[
            { id: "overview", label: "Overview" },
            { id: "testimonials", label: "Testimonials" },
            { id: "embed", label: "Embed Code" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Collection Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Collection Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share this link with your customers to collect testimonials
                </p>
                <div className="flex gap-2">
                  <Input value={collectionUrl} readOnly className="font-mono text-sm" />
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(collectionUrl, "Collection link")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Collection Page
                </Button>
              </CardContent>
            </Card>

            {/* Embed Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Wall of Love Widget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add this code to your website to display approved testimonials
                </p>
                <div className="flex gap-2">
                  <Textarea 
                    value={embedCode} 
                    readOnly 
                    className="font-mono text-sm h-20 resize-none"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(embedCode, "Embed code")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Widget
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <Badge 
                            variant={testimonial.status === "approved" ? "default" : "secondary"}
                            className={
                              testimonial.status === "approved" 
                                ? "bg-accent/10 text-accent border-accent/20" 
                                : "bg-muted"
                            }
                          >
                            {testimonial.status}
                          </Badge>
                          {testimonial.hasVideo && (
                            <Badge variant="outline" className="text-xs">
                              <Play className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        
                        <p className="text-foreground mb-3 leading-relaxed">
                          "{testimonial.testimonial}"
                        </p>
                        
                        <p className="text-sm text-muted-foreground">
                          {testimonial.email} • {testimonial.createdAt}
                        </p>
                      </div>
                    </div>
                    
                    {testimonial.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateTestimonialStatus(testimonial.id, "approved")}
                          className="bg-accent hover:bg-accent/90"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateTestimonialStatus(testimonial.id, "hidden")}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Hide
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "embed" && (
          <Card>
            <CardHeader>
              <CardTitle>Embed Your Wall of Love</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">HTML Embed Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Copy and paste this code into your website's HTML where you want the testimonials to appear.
                </p>
                <div className="flex gap-2">
                  <Textarea 
                    value={embedCode} 
                    readOnly 
                    className="font-mono text-sm h-24 resize-none"
                  />
                  <Button onClick={() => copyToClipboard(embedCode, "Embed code")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Preview: Wall of Love Widget</h4>
                <div className="bg-background p-6 rounded-lg border">
                  <div className="grid md:grid-cols-2 gap-4">
                    {testimonials.filter(t => t.status === "approved").slice(0, 2).map(testimonial => (
                      <div key={testimonial.id} className="bg-card p-4 rounded-lg shadow-soft">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                        <p className="text-sm mb-3">"{testimonial.testimonial}"</p>
                        <div className="flex items-center gap-2">
                          <img src={testimonial.avatar} alt="" className="w-6 h-6 rounded-full" />
                          <span className="text-xs font-medium">{testimonial.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <a href="#" className="text-xs text-muted-foreground hover:text-primary">
                      Made with Credo
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;