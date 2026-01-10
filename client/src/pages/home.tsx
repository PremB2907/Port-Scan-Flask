import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Radar, 
  Shield, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Terminal,
  Activity,
  Wifi,
  Lock,
  LogOut
} from "lucide-react";

interface ScanResult {
  port: number;
  status: "open" | "closed" | "filtered";
  service: string;
  version?: string;
}

const commonPorts: Record<number, string> = {
  21: "FTP",
  22: "SSH",
  23: "Telnet",
  25: "SMTP",
  53: "DNS",
  80: "HTTP",
  110: "POP3",
  143: "IMAP",
  443: "HTTPS",
  445: "SMB",
  993: "IMAPS",
  995: "POP3S",
  3306: "MySQL",
  3389: "RDP",
  5432: "PostgreSQL",
  6379: "Redis",
  8080: "HTTP-Proxy",
  8443: "HTTPS-Alt",
  27017: "MongoDB",
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [target, setTarget] = useState("");
  const [portRange, setPortRange] = useState("1-1000");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("netscan_auth");
    setLocation("/");
  };

  const simulateScan = () => {
    if (!target) return;
    
    setIsScanning(true);
    setProgress(0);
    setResults([]);
    setScanLog([`[${new Date().toLocaleTimeString()}] Initializing scan on ${target}...`]);

    const [startPort, endPort] = portRange.split("-").map(Number);
    const totalPorts = endPort - startPort + 1;
    let currentPort = startPort;
    const newResults: ScanResult[] = [];

    const scanInterval = setInterval(() => {
      const batchSize = Math.min(50, endPort - currentPort + 1);
      
      for (let i = 0; i < batchSize; i++) {
        const port = currentPort + i;
        const isOpen = Math.random() > 0.92;
        const isFiltered = !isOpen && Math.random() > 0.95;
        
        if (isOpen || isFiltered) {
          const result: ScanResult = {
            port,
            status: isOpen ? "open" : "filtered",
            service: commonPorts[port] || "Unknown",
            version: isOpen ? `v${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 10)}` : undefined
          };
          newResults.push(result);
          setResults([...newResults]);
          setScanLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Port ${port}: ${result.status.toUpperCase()} - ${result.service}`]);
        }
      }

      currentPort += batchSize;
      const newProgress = Math.min(100, ((currentPort - startPort) / totalPorts) * 100);
      setProgress(newProgress);

      if (currentPort > endPort) {
        clearInterval(scanInterval);
        setIsScanning(false);
        setScanLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Scan complete. Found ${newResults.filter(r => r.status === "open").length} open ports.`]);
      }
    }, 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "filtered":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      closed: "bg-red-500/20 text-red-400 border-red-500/30",
      filtered: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    };
    return variants[status] || "";
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute inset-0 scan-line pointer-events-none opacity-50" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 glow-cyan">
              <Radar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="text-foreground">Shadow</span>
                <span className="text-primary glow-text">Scan</span>
              </h1>
              <p className="text-muted-foreground font-mono text-xs">
                Network Intelligence Platform
              </p>
            </div>
          </div>
          <Button
            data-testid="button-logout"
            onClick={handleLogout}
            variant="outline"
            className="bg-secondary/50 border-border hover:bg-destructive/20 hover:border-destructive/50 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 mb-8" data-testid="card-scan-config">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Scan Configuration</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground mb-2 block font-mono">
                  Target Host / IP Address
                </label>
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-testid="input-target"
                    placeholder="e.g., 192.168.1.1 or example.com"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="pl-10 bg-background/50 border-input font-mono focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block font-mono">
                  Port Range
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-testid="input-port-range"
                    placeholder="1-1000"
                    value={portRange}
                    onChange={(e) => setPortRange(e.target.value)}
                    className="pl-10 bg-background/50 border-input font-mono focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors" onClick={() => setPortRange("1-1024")} data-testid="badge-common-ports">
                Common Ports (1-1024)
              </Badge>
              <Badge variant="outline" className="bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors" onClick={() => setPortRange("1-65535")} data-testid="badge-all-ports">
                All Ports (1-65535)
              </Badge>
              <Badge variant="outline" className="bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors" onClick={() => setPortRange("80,443,22,21,3306")} data-testid="badge-web-ports">
                Web Servers
              </Badge>
            </div>

            <Button
              data-testid="button-start-scan"
              onClick={simulateScan}
              disabled={isScanning || !target}
              className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-cyan disabled:opacity-50 disabled:glow-none"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Radar className="w-4 h-4 mr-2" />
                  Start Scan
                </>
              )}
            </Button>
          </Card>
        </motion.div>

        {(isScanning || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50" data-testid="card-results">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">Scan Results</h2>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {results.filter(r => r.status === "open").length} Open
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {results.filter(r => r.status === "filtered").length} Filtered
                  </span>
                </div>
              </div>

              {isScanning && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-mono">Progress</span>
                    <span className="text-primary font-mono">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-secondary" />
                </div>
              )}

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {results.length === 0 && !isScanning && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Wifi className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-mono text-sm">No results yet. Start a scan to begin.</p>
                    </div>
                  )}
                  {results.map((result, index) => (
                    <motion.div
                      key={`${result.port}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                      data-testid={`row-port-${result.port}`}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <span className="font-mono font-semibold text-foreground">
                            Port {result.port}
                          </span>
                          <span className="text-muted-foreground mx-2">•</span>
                          <span className="text-primary font-mono text-sm">
                            {result.service}
                          </span>
                          {result.version && (
                            <span className="text-muted-foreground text-xs ml-2">
                              {result.version}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getStatusBadge(result.status)} border font-mono text-xs`}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50" data-testid="card-terminal">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Scan Log</h2>
              </div>
              
              <div className="bg-background rounded-lg p-4 font-mono text-xs h-[400px] overflow-y-auto border border-border/50">
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>netscan@pro:~$</span>
                  <span className="text-primary">./scan --target {target || "..."}</span>
                </div>
                {scanLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mb-1 ${
                      log.includes("OPEN") 
                        ? "text-emerald-400" 
                        : log.includes("FILTERED")
                        ? "text-amber-400"
                        : log.includes("complete")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    data-testid={`text-log-${index}`}
                  >
                    {log}
                  </motion.div>
                ))}
                {isScanning && (
                  <span className="inline-block w-2 h-4 bg-primary terminal-cursor ml-1" />
                )}
              </div>
            </Card>
          </motion.div>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-muted-foreground text-sm font-mono"
        >
          <p>ShadowScan • For authorized security testing only</p>
        </motion.footer>
      </div>
    </div>
  );
}
