
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserPlan } from '../types';

interface AIChatProps {
  user: UserPlan;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Olá ${user.name}! Sou seu assistente de elite. Como posso te ajudar com seus treinos ou dieta hoje? Lembre-se: foco na segurança da sua lombar!` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest config
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Fix: 'sciaticaNotes' replaced with 'clinicalRestrictions' which exists in UserPlan
      const context = `
        Você é um treinador de elite especialista em biomecânica e recomposição corporal.
        Informações do usuário:
        - Nome: ${user.name}
        - Objetivo: ${user.objective}
        - Peso Atual: ${user.currentWeight}kg, Meta: ${user.targetWeight}kg
        - Restrição Médica: ${user.clinicalRestrictions.join(', ')}
        - Substituições Sugeridas: ${user.prohibitedSubstitutions.map(s => `${s.original} por ${s.elite}`).join(', ')}
        
        Regras: 
        1. Se ele perguntar sobre substituir um exercício que cause dor lombar, recomende SEMPRE máquinas com apoio torácico.
        2. Seja motivador mas técnico.
        3. Nunca sugira Agachamento Livre ou Remada Curvada sem apoio para este usuário.
      `;

      // Use ai.models.generateContent to fetch response from Gemini
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${context}\n\nUsuário pergunta: ${userMsg}`,
      });

      // Extract text from the response using the .text property
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Desculpe, tive um erro de conexão." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Erro ao conectar com o servidor. Verifique sua conexão." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end p-4 pointer-events-none">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col h-[80vh] sm:h-[600px] pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-10">
        <div className="p-4 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-amber-500">Coach de Elite AI</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-amber-500 text-black font-medium' : 'bg-zinc-800 text-zinc-300'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 p-3 rounded-2xl flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-800 border-t border-zinc-700">
          <div className="flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre exercícios..."
              className="flex-1 bg-zinc-900 border border-zinc-700 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="bg-amber-500 p-3 rounded-xl text-black hover:bg-amber-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
