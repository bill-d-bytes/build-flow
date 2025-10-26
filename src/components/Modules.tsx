import { ShoppingCart, Users, BarChart3 } from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import materialsImage from "@/assets/materials-ecommerce.jpg";
import communityImage from "@/assets/community-collaboration.jpg";
import projectImage from "@/assets/project-management.jpg";

export const Modules = () => {
  const modules = [
    {
      title: "Material Supply E-commerce",
      description: "Streamline your procurement with AI-powered material sourcing, verified suppliers, and integrated logistics management.",
      features: [
        "Comprehensive material catalog with detailed specifications",
        "Verified supplier network with KYC and GST validation",
        "Integrated transportation booking and waybill generation",
        "AI-based visual recognition for instant cart generation",
        "Real-time inventory tracking and automated reorder alerts",
        "Secure payment gateway with GST-compliant invoicing"
      ],
      icon: ShoppingCart,
      image: materialsImage,
      gradient: "primary" as const,
      link: "/materials",
    },
    {
      title: "Community Collaboration",
      description: "Connect with industry professionals, find skilled workforce, and access specialized services all in one platform.",
      features: [
        "Professional networking for contractors and engineers",
        "Service marketplace for architecture, plumbing, electrical work",
        "Manpower supply and skilled labor listings",
        "Equipment rental marketplace (machines, tools, scaffolding)",
        "AI-powered service matching and recommendations",
        "Portfolio management with ratings and reviews"
      ],
      icon: Users,
      image: communityImage,
      gradient: "accent" as const,
    },
    {
      title: "Project Management & AI Analytics",
      description: "Manage construction projects with intelligent insights, predictive analytics, and proactive recommendations.",
      features: [
        "Multi-project dashboard with real-time progress tracking",
        "AI-driven cost forecasting and variance analysis",
        "Automated material replenishment alerts",
        "Task management with dependency tracking",
        "Predictive delay analysis considering weather and holidays",
        "AI chatbot for project summaries and safety protocols"
      ],
      icon: BarChart3,
      image: projectImage,
      gradient: "primary" as const,
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Three Powerful Modules,
            <span className="block text-primary">One Integrated Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to digitally transform your construction business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ModuleCard key={index} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
};
