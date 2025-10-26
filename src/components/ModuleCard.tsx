import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  image: string;
  gradient: "primary" | "accent";
  link?: string;
}

export const ModuleCard = ({
  title,
  description,
  features,
  icon: Icon,
  image,
  gradient,
  link,
}: ModuleCardProps) => {
  const gradientClass = gradient === "primary" 
    ? "from-primary/10 to-primary-glow/5" 
    : "from-accent/10 to-accent-glow/5";
  
  const iconColorClass = gradient === "primary" ? "text-primary" : "text-accent";

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 shadow-elegant hover:shadow-glow">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-60`}></div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} border border-border/50`}>
            <Icon className={`w-6 h-6 ${iconColorClass}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${iconColorClass === "text-primary" ? "bg-primary" : "bg-accent"} mt-2 flex-shrink-0`}></div>
              <span className="text-sm text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        {link ? (
          <Link to={link} className="w-full">
            <Button variant="ghost" className={`w-full ${iconColorClass} hover:bg-primary/5 group/btn`}>
              Learn More
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" className={`w-full ${iconColorClass} hover:bg-primary/5 group/btn`}>
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        )}
      </div>
    </Card>
  );
};
