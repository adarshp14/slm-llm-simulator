import { motion } from "framer-motion";
import SimulationPanel from "@/components/simulation-panel";
import PerformanceChart from "@/components/performance-chart";
import ResponseShowcase from "@/components/response-showcase";
import CostCalculator from "@/components/cost-calculator";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: comparisons, isLoading } = useQuery({
    queryKey: ["/api/comparisons"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-display text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Language Model Comparison
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore the trade-offs between small and large language models through
            this interactive demonstration.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <SimulationPanel />
          <PerformanceChart data={comparisons} isLoading={isLoading} />
        </div>

        <div className="mt-12">
          <ResponseShowcase data={comparisons} isLoading={isLoading} />
        </div>

        <div className="mt-12">
          <CostCalculator />
        </div>
      </main>
    </div>
  );
}
