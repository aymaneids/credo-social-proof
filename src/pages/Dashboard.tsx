import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Copy, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Zap, 
  Palette, 
  Code, 
  Sparkles,
  Play,
  Check,
  X,
  BarChart3
} from "lucide-react";
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
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();

  const collectionUrl = "https://credo.so/your-startup";

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast({
      title: "Copied! ✨",
      description: `${type} copied to clipboard`,
    });
  };

  const updateTestimonialStatus = (id: number, status: "approved" | "hidden") => {
    setTestimonials(prev => 
      prev.map(t => t.id === id ? { ...t, status } : t)
    );
    toast({
      title: status === "approved" ? "🎉 Testimonial Approved!" : "📁 Testimonial Archived",
      description: status === "approved" 
        ? "This testimonial is now live on your Wall of Love" 
        : "This testimonial has been moved to archive",
    });
  };

  const embedTemplates = {
    modern: {
      name: "Modern Grid",
      description: "Clean grid layout with smooth hover effects and modern styling",
      preview: "Responsive 3-column grid with cards that scale on hover",
      code: `<script src="https://cdn.credo.so/widget.js" 
  data-credo-id="your-startup" 
  data-template="modern"
  data-columns="3"
  data-show-rating="true"
  data-show-photos="true"
  data-theme="light"></script>`
    },
    carousel: {
      name: "Carousel Slider", 
      description: "Auto-sliding testimonials with smooth transitions",
      preview: "Horizontal slider with automatic progression and navigation dots",
      code: `<script src="https://cdn.credo.so/widget.js"
  data-credo-id="your-startup"
  data-template="carousel"
  data-autoplay="true"
  data-speed="4000"
  data-show-navigation="true"></script>`
    },
    minimal: {
      name: "Minimal List",
      description: "Simple, clean testimonial list perfect for sidebars", 
      preview: "Elegant list view with subtle borders and clean typography",
      code: `<script src="https://cdn.credo.so/widget.js"
  data-credo-id="your-startup"
  data-template="minimal"
  data-show-photos="false"
  data-max-items="5"></script>`
    },
    masonry: {
      name: "Masonry Layout",
      description: "Pinterest-style dynamic grid that adapts to content length",
      preview: "Dynamic grid where testimonials flow naturally based on content height",
      code: `<script src="https://cdn.credo.so/widget.js"
  data-credo-id="your-startup" 
  data-template="masonry"
  data-columns="auto"
  data-gap="16"></script>`
    },
    hero: {
      name: "Hero Banner",
      description: "Large, attention-grabbing testimonial display for hero sections",
      preview: "Single featured testimonial with large text and prominent styling",
      code: `<script src="https://cdn.credo.so/widget.js"
  data-credo-id="your-startup"
  data-template="hero"
  data-featured="true"
  data-show-company="true"></script>`
    }
  };

  const pendingCount = testimonials.filter(t => t.status === "pending").length;
  const approvedCount = testimonials.filter(t => t.status === "approved").length;
  const totalCount = testimonials.length;
  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length 
    : 0;

  return (
    <div className="min-h-screen bg-background-gradient">
      {/* Enhanced Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-hero-gradient rounded-xl flex items-center justify-center shadow-glow animate-pulse">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-foreground">Credo Dashboard</h1>
                <p className="text-xs text-muted-foreground">Social Proof Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  Hacker Plan (Free)
                </Badge>
                <span className="text-xs text-muted-foreground">21 testimonials left</span>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-muted/20 transition-all duration-200">
                Upgrade to Founder
              </Button>
              <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border-2 border-primary/20 hover:scale-110 transition-transform">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-background/50 to-accent/10 p-8 border border-border/40 backdrop-blur-sm overflow-hidden animate-fade-in">
          <div className="absolute top-4 right-4">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="relative space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Welcome back, John! 👋</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your social proof engine is running strong! You're transforming customer love into 
              powerful growth fuel. Here's your testimonial mission control.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Collection link active</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Widget live & ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>{pendingCount} awaiting your review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/40 animate-fade-in" style={{animationDelay: '100ms'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">{totalCount}</p>
                <p className="text-sm text-muted-foreground">Total Testimonials</p>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/40 animate-fade-in" style={{animationDelay: '200ms'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-xs text-green-500 font-semibold bg-green-500/10 px-2 py-1 rounded-full">LIVE</div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Live on Website</p>
                <p className="text-xs text-green-600">Driving conversions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/40 animate-fade-in" style={{animationDelay: '300ms'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <EyeOff className="w-6 h-6 text-yellow-500" />
                </div>
                {pendingCount > 0 && <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>}
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Awaiting Review</p>
                <p className="text-xs text-yellow-600">Ready for approval</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/40 animate-fade-in" style={{animationDelay: '400ms'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(averageRating) ? 'text-accent fill-current' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-xs text-accent">Exceptional quality</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2 bg-muted/30">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-4 h-4" />
              Setup & Links
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4" />
              Testimonials
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs bg-yellow-500/20 text-yellow-700">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Code className="w-4 h-4" />
              Widget Code
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enhanced Collection Link */}
              <Card className="border-border/40 hover:shadow-strong transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-primary" />
                        Customer Collection Link
                      </CardTitle>
                      <CardDescription>
                        Your beautiful, zero-friction testimonial collection page. 
                        No signup required for customers.
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      ACTIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative group/url">
                    <Input 
                      value={collectionUrl} 
                      readOnly 
                      className="font-mono text-sm pr-12 bg-muted/50 group-hover/url:bg-muted/70 transition-colors" 
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 h-8 w-8 p-0 opacity-0 group-hover/url:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(collectionUrl, "Collection link")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="flex-1 hover:scale-105 transition-transform"
                      onClick={() => copyToClipboard(collectionUrl, "Collection link")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-muted/20">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <p className="text-sm text-foreground font-medium mb-2">💡 Growth Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Add this link to your email signatures, thank you pages, and onboarding flows. 
                      The easier you make it, the more testimonials you'll collect!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border/40 hover:shadow-strong transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>
                    How your social proof is performing this month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Collection Page Views</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="font-semibold text-green-600">12.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Widget Views</span>
                      <span className="font-semibold">2,891</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg. Time to Submit</span>
                      <span className="font-semibold">2m 15s</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/40">
                    <div className="text-sm text-muted-foreground mb-2">This Month's Growth</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+34% more testimonials</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Customer Love Inbox
                    </CardTitle>
                    <CardDescription>
                      Review, approve, and curate the testimonials that will fuel your growth
                    </CardDescription>
                  </div>
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="animate-pulse">
                      {pendingCount} awaiting your review
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={testimonial.id} 
                      className="group border border-border/40 rounded-xl p-6 hover:shadow-medium transition-all duration-300 hover:border-primary/20 animate-fade-in"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex gap-4 flex-1">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full ring-2 ring-background shadow-medium"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                              <Badge 
                                variant={testimonial.status === "approved" ? "default" : "secondary"}
                                className={
                                  testimonial.status === "approved" 
                                    ? "bg-green-500/10 text-green-700 border-green-500/20" 
                                    : testimonial.status === "pending"
                                    ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                                    : "bg-muted"
                                }
                              >
                                {testimonial.status === "approved" ? (
                                  <><Eye className="w-3 h-3 mr-1" />LIVE</>
                                ) : testimonial.status === "pending" ? (
                                  <><EyeOff className="w-3 h-3 mr-1" />PENDING</>
                                ) : (
                                  "HIDDEN"
                                )}
                              </Badge>
                              {testimonial.hasVideo && (
                                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700 border-purple-500/20">
                                  <Play className="w-3 h-3 mr-1" />
                                  Video
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">({testimonial.rating}/5 stars)</span>
                            </div>
                            
                            <blockquote className="text-foreground leading-relaxed pl-4 border-l-2 border-accent/30 italic">
                              "{testimonial.testimonial}"
                            </blockquote>
                            
                            <p className="text-sm text-muted-foreground">
                              {testimonial.email} • {testimonial.createdAt}
                            </p>
                          </div>
                        </div>
                        
                        {testimonial.status === "pending" && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="hero"
                              className="hover:scale-105 transition-transform"
                              onClick={() => updateTestimonialStatus(testimonial.id, "approved")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-muted/20"
                              onClick={() => updateTestimonialStatus(testimonial.id, "hidden")}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Archive
                            </Button>
                          </div>
                        )}
                        
                        {testimonial.status === "approved" && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/5 px-3 py-1 rounded-lg border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live on website</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Embed Tab */}
          <TabsContent value="embed" className="space-y-6">
            <Card className="border-border/40 hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-accent" />
                      Wall of Love Widget Templates
                    </CardTitle>
                    <CardDescription>
                      Choose your perfect template and copy the embed code. Updates automatically with new testimonials.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">
                    {Object.keys(embedTemplates).length} Templates Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Template Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Choose Template Style</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="w-64 bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(embedTemplates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Palette className="w-4 h-4" />
                              {template.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Template Preview Info */}
                  <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-6 border border-border/60">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-hero-gradient rounded-xl flex items-center justify-center shadow-glow">
                        <Palette className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-foreground text-lg">{embedTemplates[selectedTemplate as keyof typeof embedTemplates].name}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{embedTemplates[selectedTemplate as keyof typeof embedTemplates].description}</p>
                        <p className="text-xs text-accent font-medium bg-accent/10 px-3 py-1 rounded-full inline-block">
                          ✨ {embedTemplates[selectedTemplate as keyof typeof embedTemplates].preview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Ready-to-Use Embed Code</h3>
                    {copiedCode && (
                      <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Copied to clipboard!</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative group/code">
                    <pre className="p-6 bg-card rounded-xl font-mono text-sm border border-border/60 overflow-x-auto group-hover/code:border-primary/40 transition-all max-h-48 scrollbar-thin">
                      <code className="text-foreground whitespace-pre">
                        {embedTemplates[selectedTemplate as keyof typeof embedTemplates].code}
                      </code>
                    </pre>
                    <div className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-muted-foreground border border-border/40">
                        Click to copy code
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="hero" 
                    className="w-full hover:scale-105 transition-transform text-lg py-6"
                    onClick={() => copyToClipboard(embedTemplates[selectedTemplate as keyof typeof embedTemplates].code, "Embed code")}
                  >
                    <Copy className="w-5 h-5 mr-3" />
                    Copy Embed Code
                  </Button>
                </div>
                
                {/* Implementation Guide */}
                <div className="bg-accent/5 rounded-xl p-6 border border-accent/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h4 className="font-semibold text-foreground">🚀 Ready to Go Live?</h4>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Step 1:</strong> Copy the embed code above
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Step 2:</strong> Paste it anywhere in your website's HTML (works in WordPress, Webflow, custom sites, etc.)
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Step 3:</strong> Watch the magic happen! Your widget will automatically display approved testimonials and update in real-time
                    </p>
                  </div>
                  <div className="pt-3 border-t border-accent/20">
                    <p className="text-xs text-accent font-medium">
                      💡 Pro tip: Place your widget on high-traffic pages like your homepage, pricing page, or checkout flow for maximum impact
                    </p>
                  </div>
                </div>
                
                {/* Live Preview */}
                <div className="bg-muted/20 rounded-xl p-6 border border-border/40">
                  <h4 className="font-semibold mb-4 text-foreground">Live Preview: How it looks on your site</h4>
                  <div className="bg-background p-6 rounded-lg border-2 border-dashed border-border/60 min-h-48">
                    <div className="grid md:grid-cols-2 gap-4 opacity-75">
                      {testimonials.filter(t => t.status === "approved").slice(0, 2).map(testimonial => (
                        <div key={testimonial.id} className="bg-card p-4 rounded-lg shadow-soft border border-border/40 hover:shadow-medium transition-all">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                          </div>
                          <p className="text-sm mb-4 text-muted-foreground italic">"{testimonial.testimonial}"</p>
                          <div className="flex items-center gap-3">
                            <img src={testimonial.avatar} alt="" className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="text-sm font-medium text-foreground">{testimonial.name}</div>
                              <div className="text-xs text-muted-foreground">{testimonial.email.split('@')[1]}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-6">
                      <a href="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                        ✨ Made with Credo
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;