
import React, { useState } from 'react';
import { TrainingDay, Exercise, CheckIn } from '../types';

interface TrainingSectionProps {
  schedule: TrainingDay[];
  checkIns: CheckIn[];
  onCheckIn: (dayIndex: number, weight: number) => void;
  scheduleType: 'days' | 'sessions';
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ schedule, checkIns, onCheckIn, scheduleType }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState('');

  const isChecked = (idx: number) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.some(c => c.dayIndex === idx && c.date === today);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
          {scheduleType === 'days' ? 'Cronograma Semanal' : 'Sequência de Treinos'}
        </h2>
        <div className="hidden sm:block h-px flex-1 mx-8 bg-zinc-800"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {schedule.map((day, idx) => (
          <div key={idx} className={`bg-zinc-900 border rounded-3xl overflow-hidden shadow-xl transition-all ${isChecked(idx) ? 'border-amber-500/40 opacity-70 bg-zinc-900/50' : 'border-zinc-800'}`}>
            <div className="p-6 bg-zinc-800/30 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800">
              <div className="flex items-center gap-4">
                <button 
                  disabled={isChecked(idx)}
                  onClick={() => setShowCheckInModal(idx)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isChecked(idx) ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{day.day}</span>
                  <h3 className="text-xl font-bold">{day.focus}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-black/40 rounded-full text-[10px] font-black uppercase tracking-tighter text-zinc-500">{day.groups}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${day.intensity.includes('Alta') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{day.intensity}</span>
              </div>
            </div>

            {!isChecked(idx) && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {day.exercises?.map((ex, eIdx) => (
                    <div key={eIdx} className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50 group hover:border-amber-500/30 transition-all flex flex-col justify-between min-h-[140px]">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-white">{ex.name}</h4>
                          <button onClick={() => setSelectedExercise(ex)} className="text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          </button>
                        </div>
                        {ex.technique && <p className="text-[10px] text-amber-500 font-black uppercase mt-1">{ex.technique}</p>}
                      </div>
                      <div className="mt-4 flex justify-between items-center border-t border-zinc-700/50 pt-3">
                        <span className="text-xs font-mono font-bold text-zinc-400">Sets</span>
                        <span className="text-xs font-mono font-black text-blue-400">{ex.sets}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals remain the same... */}
      {showCheckInModal !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCheckInModal(null)}></div>
          <div className="relative w-full max-w-sm bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl space-y-6">
            <h3 className="text-2xl font-black uppercase text-center italic tracking-tighter">Check-In</h3>
            <p className="text-zinc-500 text-center text-sm leading-relaxed">Boa! Informe seu peso hoje para otimizarmos seus resultados.</p>
            <input 
              autoFocus
              type="number" 
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full p-5 bg-zinc-800 border border-zinc-700 rounded-2xl text-3xl font-black text-center text-amber-500 outline-none"
            />
            <button 
              onClick={() => {
                const w = parseFloat(weightInput);
                if (w > 0) {
                  onCheckIn(showCheckInModal, w);
                  setShowCheckInModal(null);
                  setWeightInput('');
                }
              }}
              className="w-full py-5 bg-amber-500 text-black font-black uppercase rounded-2xl shadow-xl shadow-amber-500/20"
            >
              Confirmar Peso
            </button>
          </div>
        </div>
      )}

      {selectedExercise && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95" onClick={() => setSelectedExercise(null)}></div>
          <div className="relative w-full max-w-lg bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="p-8 flex justify-between border-b border-zinc-800 items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{selectedExercise.name}</h3>
              <button onClick={() => setSelectedExercise(null)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-800 border border-zinc-700">
                {selectedExercise.executionImages?.[0] ? (
                  <img src={selectedExercise.executionImages[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-black uppercase">Sem imagem disponível</div>
                )}
              </div>
              <p className="text-sm text-zinc-400 italic text-center leading-relaxed">"{selectedExercise.justification || 'Foco na cadência e controle do movimento.'}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSection;
