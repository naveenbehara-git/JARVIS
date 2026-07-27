export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface ReactorStatus {
  status: string;
  output: string;
  coreTemp: string;
  efficiency: string;
}

export interface MarkArmorStatus {
  model: string;
  powerLevel: string;
  thrusters: string;
  weaponsStatus: string;
  holographicGrid: string;
}

export interface NeuralLinkStatus {
  latency: string;
  bandwidth: string;
  networkSpeed?: string;
  nodeStatus: string;
}

export interface DiagnosticsData {
  arcReactor: ReactorStatus;
  markArmor: MarkArmorStatus;
  neuralLink: NeuralLinkStatus;
  systemLogs: string[];
}

export interface MauiFileTemplate {
  name: string;
  path: string;
  language: "kotlin" | "groovy" | "csharp" | "razor" | "xml" | "markdown";
  description: string;
  code: string;
}
