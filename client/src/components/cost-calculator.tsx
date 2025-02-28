import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function CostCalculator() {
  const [requests, setRequests] = useState([1000]);
  
  const smallModelCost = requests[0] * 0.001;
  const largeModelCost = requests[0] * 0.005;
  const savings = largeModelCost - smallModelCost;

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-display">Cost Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <label className="text-sm text-muted-foreground">
              Number of Requests per Month
            </label>
            <Slider
              value={requests}
              onValueChange={setRequests}
              max={10000}
              step={100}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {requests[0].toLocaleString()} requests
            </p>
          </div>

          <motion.div
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Small Model Cost</p>
                <p className="text-2xl font-bold">${smallModelCost.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Large Model Cost</p>
                <p className="text-2xl font-bold">${largeModelCost.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold">${savings.toFixed(2)}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
