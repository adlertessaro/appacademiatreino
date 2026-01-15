
import React, { useState, useMemo, useEffect } from 'react';
import { UserPlan } from '../types';
import TrainingSection from './TrainingSection';
import NutritionSection from './NutritionSection';
import BiomechanicsSection from './BiomechanicsSection';
import AIChat from './AIChat';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  user: UserPlan;
  onUpdateUser: (user: UserPlan) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'training' | 'nutrition' | 'biomechanics' | 'tips'>('training');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [performanceTip, setPerformanceTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Trigger performance tip update whenever user data changes (especially after weight entry)
  useEffect(() => {
    const fetchPerformanceTip = async () => {
      setLoadingTip(true);
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
        
        const lastCheckIn = user.checkIns?.[user.checkIns?.length - 1];
        const workoutContext = lastCheckIn 
          ? `O atleta acabou de completar o treino: ${user.weeklySchedule[lastCheckIn.dayIndex]?.focus}.`
          : "O atleta está iniciando o dia.";

        const prompt = `Aja como um Coach de Elite. Analise os novos dados do atleta e forneça uma Dica de Performance MESTRA para alcançar o objetivo.
        DADOS ATUAIS:
        - Nome: ${user.name}
        - Objetivo: ${user.objective}
        - Peso Atual: ${user.currentWeight}kg (Meta: ${user.targetWeight}kg)
        - Restrições: ${user.clinicalRestrictions.join(', ')}
        - Contexto: ${workoutContext}
        
        Refaça mentalmente os cálculos de progresso e dê uma orientação estratégica (máximo 2 frases) para garantir que ele chegue aos ${user.targetWeight}kg com segurança biomecânica.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        setPerformanceTip(response.text || 'Mantenha a constância e respeite seus limites biomecânicos.');
      } catch (err) {
        setPerformanceTip('Foco total na execução. Sua lombar agradece o controle.');
      } finally {
        setLoadingTip(false);
        setIsRecalculating(false);
      }
    };
    fetchPerformanceTip();
  }, [user.currentWeight, user.id, user.checkIns?.length || 0]);

  const progressStats = useMemo(() => {
    if (!user.weightHistory || user.weightHistory.length < 2) return { velocity: 0, weeksLeft: 'Calculando...' };
    const start = user.weightHistory[0];
    const latest = user.weightHistory[user.weightHistory.length - 1];
    const diff = start.weight - latest.weight;
    const timeDiff = (new Date(latest.date).getTime() - new Date(start.date).getTime()) / (1000 * 60 * 60 * 24 * 7);
    const velocity = timeDiff > 0 ? diff / timeDiff : 0.5;
    const remaining = latest.weight - user.targetWeight;
    const weeks = Math.max(0, Math.ceil(remaining / (velocity || 0.5)));
    return { velocity: velocity.toFixed(2), weeksLeft: remaining <= 0 ? 'Meta Atingida!' : `${weeks} semanas` };
  }, [user.weightHistory, user.targetWeight]);

  const handleCheckIn = (dayIndex: number, weight: number) => {
    setIsRecalculating(true); // Trigger UI feedback that AI is working
    const today = new Date().toISOString().split('T')[0];
    const updatedCheckIns = [...user.checkIns, { date: today, weight, dayIndex }];
    const updatedHistory = [...user.weightHistory, { date: today, weight }];
    
    // Recalculate TMB automatically
    const newTmb = (10 * weight) + (6.25 * user.height) - (5 * user.age) + (user.sex === 'M' ? 5 : -161);
    
    onUpdateUser({
      ...user, 
      currentWeight: weight, 
      tmb: Math.round(newTmb), 
      weightHistory: updatedHistory, 
      checkIns: updatedCheckIns
    });

    // Switch to tips tab to show the new advice
    setActiveTab('tips');
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black text-xl">E</div>
            <div>
              <h1 className="text-lg font-black leading-tight">{user.name}</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{user.objective}</p>
            </div>
          </div>
          <button onClick={onLogout} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-black uppercase rounded-lg border border-zinc-700">Sair</button>
        </div>
      </header>

      {isRecalculating && (
        <div className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] py-2 text-center animate-pulse">
          Agente IA recalculando estratégia baseada no novo peso...
        </div>
      )}

      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <StatCard label="Peso Atual" value={`${user.currentWeight}kg`} color="text-amber-500" />
          <StatCard label="Meta" value={`${user.targetWeight}kg`} color="text-green-500" />
          <StatCard label="Velocidade" value={`${progressStats.velocity}kg/sem`} color="text-blue-400" />
          <StatCard label="Tempo Estimado" value={progressStats.weeksLeft} color="text-purple-400" />
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex p-1.5 bg-zinc-900 rounded-2xl gap-2 overflow-x-auto border border-zinc-800">
          <TabButton active={activeTab === 'training'} onClick={() => setActiveTab('training')} label="Treinamento" />
          <TabButton active={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} label="Nutrição" />
          <TabButton active={activeTab === 'biomechanics'} onClick={() => setActiveTab('biomechanics')} label="Biomecânica" />
          <TabButton active={activeTab === 'tips'} onClick={() => setActiveTab('tips')} label="Estratégia" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'training' && <TrainingSection schedule={user.weeklySchedule} checkIns={user.checkIns} onCheckIn={handleCheckIn} scheduleType={user.scheduleType} />}
        {activeTab === 'nutrition' && <NutritionSection user={user} macros={user.macros} supplements={user.supplements} />}
        {activeTab === 'biomechanics' && <BiomechanicsSection user={user} />}
        {activeTab === 'tips' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Performance Hub</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="m17 17-5 5-5-5"/></svg>
               </div>
               <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-1 h-3 bg-amber-500 rounded"></span> Dica AI Recalculada
               </h4>
               {loadingTip ? (
                 <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                 </div>
               ) : (
                 <p className="text-xl font-bold text-white leading-relaxed italic">"{performanceTip}"</p>
               )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TipCard title="Recuperação Ativa" content="Com o novo peso, sua TMB mudou. O Agente de Nutrição atualizou as recomendações de macros." />
              <TipCard title="Consistência de Elite" content="Você está a caminho. Cada check-in refina sua trajetória para os 87kg." />
            </div>
          </div>
        )}
      </main>

      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60]">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>

      {isChatOpen && <AIChat user={user} onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-white" }) => (
  <div className="space-y-1">
    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`flex-1 min-w-max py-4 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-zinc-800 text-amber-500' : 'text-zinc-600 hover:text-zinc-300'}`}>{label}</button>
);

const TipCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] group">
    <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
      <span className="w-1 h-3 bg-amber-500 rounded"></span> {title}
    </h4>
    <p className="text-zinc-400 text-sm leading-relaxed">{content}</p>
  </div>
);

export default Dashboard;
