import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-accent p-12 md:p-20 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Construction Business?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join hundreds of construction professionals who are already leveraging our platform to streamline operations, reduce costs, and accelerate project delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6">
                <Mail className="mr-2 w-5 h-5" />
                Contact Sales
              </Button>
            </div>

            <div className="pt-8 text-white/80 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
