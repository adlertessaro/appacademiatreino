
import React, { useState, useEffect } from 'react';
import { Macro, UserPlan } from '../types';
import { GoogleGenAI } from "@google/genai";

interface NutritionSectionProps {
  user: UserPlan;
  macros: Macro[];
  supplements: UserPlan['supplements'];
}

const NutritionSection: React.FC<NutritionSectionProps> = ({ user, macros, supplements }) => {
  const [aiTips, setAiTips] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const lastCheckIn = user.checkIns[user.checkIns.length - 1];
        const workout = lastCheckIn ? user.weeklySchedule[lastCheckIn.dayIndex]?.focus : 'Descanso';
        
        const prompt = `Aja como um Nutricionista Esportivo de Alta Performance.
        O atleta acaba de registrar um novo peso e possivelmente completou um treino.
        Refaça os cálculos mentais para o objetivo de recomposição corporal.
        
        PERFIL:
        - Nome: ${user.name}
        - Sexo: ${user.sex === 'M' ? 'Masculino' : 'Feminino'}
        - Idade: ${user.age}
        - Objetivo: ${user.objective}
        - Peso Atual: ${user.currentWeight}kg
        - Treino de hoje (concluído): ${workout}
        
        Dê 3 orientações nutricionais CURTAS e PODEROSAS baseadas nestes novos dados para garantir que ele atinja os ${user.targetWeight}kg. Use emojis.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        setAiTips(response.text || 'Ajuste seu aporte proteico para o novo peso registrado.');
      } catch (err) {
        setAiTips('Erro ao recalcular dieta. Mantenha o foco em proteínas magras.');
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [user.currentWeight, user.id, user.checkIns.length]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {macros.map((macro, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 mx-auto">
               <span className="text-xl font-black text-amber-500">{macro.percentage}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{macro.label}</h3>
              <p className="text-2xl font-black text-white">{macro.grams}</p>
              <p className="text-xs text-zinc-500">{macro.kcal} kcal</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl border-l-4 border-l-amber-500">
        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center not-italic text-black text-xs font-black">AI</span>
          Ajuste Nutricional do Agente
        </h3>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {aiTips}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <h3 className="text-xl font-black uppercase italic mb-8">Suplementação</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supplements.map((sup, idx) => (
            <div key={idx} className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{sup.name}</h4>
              <p className="text-lg font-bold mb-2">{sup.dosage}</p>
              <p className="text-[10px] text-zinc-400">{sup.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionSection;
