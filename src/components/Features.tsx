import { Brain, Shield, Zap, TrendingUp, Globe, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Predictive analytics, smart recommendations, and automated workflows",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access, encryption, and comprehensive audit logs",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live project tracking, instant notifications, and seamless collaboration",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Data-driven insights, performance metrics, and predictive forecasting",
    },
    {
      icon: Globe,
      title: "Multi-platform Integration",
      description: "Seamless API connectivity with logistics, payment, and GST platforms",
    },
    {
      icon: Check,
      title: "Compliance Ready",
      description: "GST-compliant invoicing, KYC verification, and regulatory standards",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for the Future of
            <span className="block text-accent">Construction Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Enterprise-grade features designed for construction professionals
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-accent">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
