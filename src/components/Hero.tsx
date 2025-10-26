import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern construction site with digital technology"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Construction Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Construction Business
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            End-to-end digital ecosystem connecting material suppliers, professionals, and project management in one powerful platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/materials">
              <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg hover:shadow-glow transition-all text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 text-lg px-8 py-6">
              <Building2 className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Suppliers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">10K+</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
