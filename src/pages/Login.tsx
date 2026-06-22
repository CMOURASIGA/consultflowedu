import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@consultflow.com.br");
  const [password, setPassword] = useState("admin123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula autenticação salvando no localStorage
    localStorage.setItem("isAuthenticated", "true");
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-10">
          <img 
            src="https://i.imgur.com/gxXnYsA.png" 
            alt="Consult Services" 
            className="h-48 sm:h-56 w-full px-0 object-contain mix-blend-multiply scale-125"
          />
          <h1 className="text-3xl font-bold text-primary mt-12 tracking-tight">ConsultFlow Edu</h1>
        </div>
        
        <Card className="shadow-lg border-border">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-text text-center mb-6">Acesso ao Sistema</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text">E-mail</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2 pb-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-text">Senha</label>
                  <a href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</a>
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="bg-background"
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted mt-8">
          ConsultFlow Edu — Processos organizados. Decisões mais claras.
        </p>
      </div>
    </div>
  );
}
