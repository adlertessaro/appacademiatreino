
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (cpf: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [cpf, setCpf] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(cpf);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md p-8 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">ELITE HUB</h1>
          <p className="text-zinc-400">Entre com seu CPF para acessar seu plano personalizado.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-amber-500/20"
          >
            ACESSAR TREINO
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Dica: Use o CPF do Usuário 1 (123.456.789-01)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
