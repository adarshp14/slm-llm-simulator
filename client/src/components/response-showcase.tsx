import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ModelComparison } from "@shared/schema";

interface ResponseShowcaseProps {
  data?: ModelComparison[];
  isLoading: boolean;
}

export default function ResponseShowcase({ data, isLoading }: ResponseShowcaseProps) {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const top5 = data?.slice(0, 5) || [];

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-display">Response Showcase</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {top5.map((comparison, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Prompt: {comparison.prompt}</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Small Model</p>
                      <p>{comparison.smallModelResponse}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Large Model</p>
                      <p>{comparison.largeModelResponse}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
