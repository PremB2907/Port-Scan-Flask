import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Radar, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn,
  Shield
} from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("netscan_auth", "true");
        setLocation("/scanner");
      } else {
        setError("Please enter both email and password");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 scan-line pointer-events-none opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/15 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/30 glow-cyan mb-6"
          >
            <Radar className="w-12 h-12 text-primary" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            <span className="text-foreground">Shadow</span>
            <span className="text-primary glow-text">Scan</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Secure Network Intelligence Platform
          </p>
        </div>

        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50" data-testid="card-login">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">Secure Login</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block font-mono">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-email"
                  type="email"
                  placeholder="agent@shadowscan.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-input font-mono focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 border-input font-mono focus:border-primary focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-mono"
                data-testid="text-error"
              >
                {error}
              </motion.p>
            )}

            <Button
              data-testid="button-login"
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-cyan py-5"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Access Terminal
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-xs font-mono">
              Demo mode: Enter any credentials to continue
            </p>
          </div>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-muted-foreground text-xs font-mono"
        >
          ShadowScan v2.0 • Encrypted Connection Active
        </motion.p>
      </motion.div>
    </div>
  );
}
