
import React, { useState, useEffect } from 'react';
import { UserPlan } from '../types';
import { GoogleGenAI } from "@google/genai";

interface BiomechanicsSectionProps {
  user: UserPlan;
}

const BiomechanicsSection: React.FC<BiomechanicsSectionProps> = ({ user }) => {
  const [aiTips, setAiTips] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Como um especialista em fisioterapia esportiva e biomecânica, dê 3 dicas de segurança e proteção para um atleta com as seguintes restrições:
        - Restrições: ${user.clinicalRestrictions.join(', ')}
        
        O objetivo é evitar lesões durante treinos de alta intensidade. Seja técnico, use linguagem clara. Use emojis.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        setAiTips(response.text || 'Mantenha o core sempre ativo e evite cargas axiais diretas.');
      } catch (err) {
        setAiTips('Erro ao carregar dicas biomecânicas.');
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [user.clinicalRestrictions]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clinical Summary */}
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl space-y-4">
          <h3 className="text-xs font-black text-red-500 uppercase tracking-widest">Painel Clínico</h3>
          <ul className="space-y-2">
            {user.clinicalRestrictions.map((r, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Biomechanics Tips */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4">
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
             <span className="w-6 h-6 bg-blue-400/20 rounded flex items-center justify-center text-[10px] text-blue-400">AI</span>
             Dicas de Proteção Biomecânica
          </h3>
          {loading ? (
             <div className="space-y-2 animate-pulse">
               <div className="h-3 bg-zinc-800 rounded w-full"></div>
               <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
             </div>
          ) : (
            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap italic">
              {aiTips}
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Substituições Estratégicas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-800/40 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <th className="p-6">Proibido</th>
                <th className="p-6">Alternativa de Elite</th>
                <th className="p-6">Segurança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {user.prohibitedSubstitutions.map((sub, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 text-sm font-bold text-red-400">{sub.original}</td>
                  <td className="p-6 text-sm font-black text-green-400">{sub.elite}</td>
                  <td className="p-6 text-xs text-zinc-500 italic">{sub.protection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BiomechanicsSection;
