import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Play, Square } from "lucide-react";

interface ClassificationResponse {
  category: string;
  confidence: number;
  inference_time: number;
  model_used: string;
}

const SAMPLE_PROMPTS = [
  "I wish the app had dark mode",
  "The login page is not working",
  "Great job on the new feature",
  "Can you add export functionality?",
  "The application keeps crashing",
  "Love the new design",
  "Please fix this bug",
  "When will this be released?",
  "The performance is slow",
  "Amazing work on this update"
];

async function classifyText(endpoint: string, text: string) {
  const startTime = Date.now();
  const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error(`Classification failed: ${response.statusText}`);
  }

  const data = await response.json() as ClassificationResponse;
  return {
    response: `${data.category} (Confidence: ${(data.confidence * 100).toFixed(1)}%)`,
    time: Math.round(data.inference_time * 1000), // Convert to milliseconds
    modelInfo: data.model_used
  };
}

export default function SimulationPanel() {
  const [prompt, setPrompt] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      try {
        // Run both models in parallel
        const [smallModel, largeModel] = await Promise.all([
          classifyText('classify-small', prompt),
          classifyText('classify-large', prompt)
        ]);

        // Calculate costs (cost per second of inference time)
        const smallModelCost = Math.floor(smallModel.time * 0.001);
        const largeModelCost = Math.floor(largeModel.time * 0.005);

        const comparison = {
          prompt,
          smallModelResponse: `${smallModel.response} (${smallModel.modelInfo})`,
          largeModelResponse: `${largeModel.response} (${largeModel.modelInfo})`,
          smallModelTime: smallModel.time,
          largeModelTime: largeModel.time,
          smallModelCost,
          largeModelCost
        };

        const res = await apiRequest("POST", "/api/simulate", comparison);
        return res.json();
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to run simulation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comparisons"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run simulation. Please try again.",
      });
      setIsSimulating(false);
    },
  });

  const runSimulation = useCallback(() => {
    if (isSimulating) {
      const randomPrompt = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
      mutation.mutate(randomPrompt);
    }
  }, [isSimulating, mutation]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isSimulating) {
      runSimulation(); // Run immediately
      intervalId = setInterval(runSimulation, 2000); // Then every 2 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, runSimulation]);

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-display">Simulation Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              disabled={mutation.isPending}
              className={`w-full ${
                isSimulating 
                  ? "bg-destructive hover:bg-destructive/90" 
                  : "bg-gradient-to-r from-primary to-accent hover:opacity-90"
              }`}
            >
              {isSimulating ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Or enter your own text to classify..."
              className="mb-4"
              disabled={isSimulating}
            />
            <Button
              onClick={() => mutation.mutate(prompt)}
              disabled={mutation.isPending || !prompt || isSimulating}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Classify Text
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}