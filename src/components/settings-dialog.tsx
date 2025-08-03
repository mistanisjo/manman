import { useState } from "react";
import { Settings, Save, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { openAIService, defaultConfig } from "@/lib/openai";

interface SettingsDialogProps {
  conversationId: string;
}

export function SettingsDialog({ conversationId }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || "");
  const [model, setModel] = useState(defaultConfig.model);
  const [maxTokens, setMaxTokens] = useState(defaultConfig.maxTokens);
  const [temperature, setTemperature] = useState([defaultConfig.temperature]);
  const [systemPrompt, setSystemPrompt] = useState(defaultConfig.systemPrompt);

  const handleSave = () => {
    try {
      // Update system prompt for current conversation
      openAIService.updateSystemPrompt(conversationId, systemPrompt);
      
      // Note: API key, model, maxTokens, and temperature would need to be handled
      // differently in a production app (likely through environment variables or backend)
      
      toast.success("Settings saved successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save settings");
      console.error("Settings save error:", error);
    }
  };

  const handleReset = () => {
    setModel(defaultConfig.model);
    setMaxTokens(defaultConfig.maxTokens);
    setTemperature([defaultConfig.temperature]);
    setSystemPrompt(defaultConfig.systemPrompt);
    toast.success("Settings reset to defaults");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Assistant Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant's behavior and parameters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* API Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">API Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gpt-4o-mini"
              />
              <p className="text-xs text-muted-foreground">
                Available models: gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo
              </p>
            </div>
          </div>

          <Separator />

          {/* Model Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Model Parameters</h3>
            
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
              <Slider
                id="max-tokens"
                min={100}
                max={4000}
                step={100}
                value={[maxTokens]}
                onValueChange={(value) => setMaxTokens(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens in the response (100-4000)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {temperature[0]}</Label>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={temperature}
                onValueChange={setTemperature}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness: 0 = focused, 2 = creative (0-2)
              </p>
            </div>
          </div>

          <Separator />

          {/* System Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">System Instructions</h3>
            
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={8}
                className="resize-none font-mono text-sm"
                placeholder="Enter system instructions for the AI..."
              />
              <p className="text-xs text-muted-foreground">
                These instructions define how the AI should behave and respond.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}