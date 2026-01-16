
import React, { useState } from 'react';
import { UserPlan, TrainingDay, Exercise, Substitution, Macro } from '../types';

interface AdminDashboardProps {
  users: UserPlan[];
  onUpdateUser: (user: UserPlan) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onUpdateUser, onLogout }) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [tempAthlete, setTempAthlete] = useState<UserPlan | null>(null);

  const nonAdminUsers = users.filter(u => !u.isAdmin);

  const createInitialAthlete = (): UserPlan => ({
    id: `user-${Date.now()}`,
    name: '',
    cpf: '',
    age: 25,
    sex: 'M',
    scheduleType: 'days',
    objective: 'Recomposição Corporal',
    currentWeight: 80,
    targetWeight: 75,
    height: 170,
    tmb: 0,
    getd: 0,
    caloricTarget: '2500 kcal',
    clinicalRestrictions: [],
    prohibitedSubstitutions: [],
    weeklySchedule: [
      { day: 'Segunda-feira', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
      { day: 'Terça-feira', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
      { day: 'Quarta-feira', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
      { day: 'Quinta-feira', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
      { day: 'Sexta-feira', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
      { day: 'Sábado', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
      { day: 'Domingo', focus: 'Descanso', groups: '-', intensity: 'Nula', exercises: [] },
    ],
    macros: [
      { label: 'Proteína', percentage: '30%', grams: '0g', kcal: '0', reason: 'Recuperação' },
      { label: 'Carboidrato', percentage: '40%', grams: '0g', kcal: '0', reason: 'Energia' },
      { label: 'Gordura', percentage: '30%', grams: '0g', kcal: '0', reason: 'Hormonal' },
    ],
    supplements: [],
    weightHistory: [],
    checkIns: []
  });

  const handleStartEditing = (user: UserPlan) => {
    setTempAthlete({ ...user });
    setEditingUserId(user.id);
  };

  const handleStartAdding = () => {
    setTempAthlete(createInitialAthlete());
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setTempAthlete(null);
    setEditingUserId(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAthlete) return;
    if (!tempAthlete.name || !tempAthlete.cpf) {
      alert("Nome e CPF são obrigatórios.");
      return;
    }
    onUpdateUser(tempAthlete);
    handleCancel();
  };

  // Funções de auxílio para o tempAthlete
  const updateTemp = (fields: Partial<UserPlan>) => {
    if (tempAthlete) setTempAthlete({ ...tempAthlete, ...fields });
  };

  const handleToggleScheduleType = () => {
    if (!tempAthlete) return;
    const newType = tempAthlete.scheduleType === 'days' ? 'sessions' : 'days';
    let newSchedule = [...tempAthlete.weeklySchedule];
    
    if (newType === 'days') {
      const weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
      newSchedule = weekDays.map((d, i) => ({
        day: d,
        focus: tempAthlete.weeklySchedule[i]?.focus || 'Descanso',
        groups: tempAthlete.weeklySchedule[i]?.groups || '-',
        intensity: tempAthlete.weeklySchedule[i]?.intensity || 'Nula',
        exercises: tempAthlete.weeklySchedule[i]?.exercises || []
      }));
    } else {
      newSchedule = newSchedule.map((s, i) => ({ ...s, day: `Treino ${i + 1}` }));
    }
    updateTemp({ scheduleType: newType, weeklySchedule: newSchedule });
  };

  const handleAddExercise = (dayIdx: number) => {
    if (!tempAthlete) return;
    const ns = [...tempAthlete.weeklySchedule];
    if (!ns[dayIdx].exercises) ns[dayIdx].exercises = [];
    ns[dayIdx].exercises?.push({ name: 'Novo Exercício', sets: '3x12', technique: '', justification: '', executionImages: [] });
    updateTemp({ weeklySchedule: ns });
  };

  const updateExerciseField = (dayIdx: number, exIdx: number, field: keyof Exercise, value: any) => {
    if (!tempAthlete) return;
    const ns = [...tempAthlete.weeklySchedule];
    const ex = ns[dayIdx].exercises![exIdx];
    if (field === 'executionImages') {
      ex[field] = [value];
    } else {
      (ex as any)[field] = value;
    }
    updateTemp({ weeklySchedule: ns });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-black max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-black text-2xl shadow-lg shadow-amber-500/20 italic"></div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Painel de Controle</h1>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {!editingUserId && !isAddingNew && (
            <button onClick={handleStartAdding} className="flex-1 sm:flex-none px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-black uppercase text-xs transition-all shadow-lg shadow-amber-500/20">Novo Atleta</button>
          )}
          <button onClick={onLogout} className="flex-1 sm:flex-none px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700">Sair</button>
        </div>
      </header>

      {!editingUserId && !isAddingNew ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Botão de Adicionar como Card */}
          <div 
            onClick={handleStartAdding}
            className="border-2 border-dashed border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-amber-500/50 transition-all min-h-[250px]"
          >
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 group-hover:text-amber-500 group-hover:scale-110 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <p className="text-zinc-600 font-black uppercase text-xs tracking-widest group-hover:text-amber-500">Recrutar Novo Atleta</p>
          </div>

          {nonAdminUsers.map(u => (
            <div key={u.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-amber-500/50 transition-all cursor-pointer group" onClick={() => handleStartEditing(u)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black group-hover:text-amber-500 transition-colors">{u.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">{u.cpf}</p>
                </div>
                <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{u.currentWeight}kg</div>
              </div>
              <div className="flex gap-4 text-[10px] font-black text-zinc-500 uppercase">
                <span>{u.age} anos</span>
                <span>•</span>
                <span>{u.sex === 'M' ? 'Masculino' : 'Feminino'}</span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1 italic">"{u.objective}"</p>
              <button className="w-full py-3 bg-zinc-800 group-hover:bg-amber-500 group-hover:text-black text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Editar Atleta</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 sm:p-10 space-y-12 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-8">
             <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-amber-500">
                  {isAddingNew ? 'Recrutamento de Atleta' : 'Configuração de Performance'}
                </h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  {isAddingNew ? 'Cadastrando novo perfil no hub' : `Atleta: ${tempAthlete?.name}`}
                </p>
             </div>
             <button onClick={handleCancel} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Cancelar</button>
          </div>

          <form onSubmit={handleSave} className="space-y-16">
            {/* Seção 1: Bio & Antropometria */}
            <section className="space-y-8">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                <span className="w-1 h-4 bg-amber-500 rounded"></span> Identificação & Bio
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Nome Completo</label>
                  <input required className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700 focus:ring-2 focus:ring-amber-500 outline-none" value={tempAthlete?.name} onChange={(e) => updateTemp({ name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">CPF (apenas números)</label>
                  <input required maxLength={11} className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700 font-mono" value={tempAthlete?.cpf} onChange={(e) => updateTemp({ cpf: e.target.value.replace(/\D/g, '') })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Idade</label>
                  <input type="number" className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700" value={tempAthlete?.age} onChange={(e) => updateTemp({ age: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Sexo</label>
                  <select className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700 text-white" value={tempAthlete?.sex} onChange={(e) => updateTemp({ sex: e.target.value as 'M' | 'F' })}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Peso Atual (kg)</label>
                  <input type="number" step="0.1" className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700" value={tempAthlete?.currentWeight} onChange={(e) => updateTemp({ currentWeight: parseFloat(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Peso Meta (kg)</label>
                  <input type="number" step="0.1" className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700" value={tempAthlete?.targetWeight} onChange={(e) => updateTemp({ targetWeight: parseFloat(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Altura (cm)</label>
                  <input type="number" className="w-full bg-zinc-800 p-4 rounded-2xl border border-zinc-700" value={tempAthlete?.height} onChange={(e) => updateTemp({ height: parseFloat(e.target.value) })} />
                </div>
              </div>
            </section>

            {/* Seção 2: Saúde & Biomecânica */}
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1 h-4 bg-red-500 rounded"></span> Restrições & Segurança
                </h4>
                <div className="flex gap-4">
                   <button type="button" onClick={() => updateTemp({ clinicalRestrictions: [...tempAthlete!.clinicalRestrictions, 'Nova Restrição'] })} className="text-[10px] font-black text-red-500 uppercase">+ Add Restrição</button>
                   <button type="button" onClick={() => updateTemp({ prohibitedSubstitutions: [...tempAthlete!.prohibitedSubstitutions, { original: '', elite: '', protection: '' }] })} className="text-[10px] font-black text-blue-500 uppercase">+ Add Substituição</button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 mb-2">Restrições Clínicas</p>
                    <div className="grid grid-cols-1 gap-2">
                      {tempAthlete?.clinicalRestrictions.map((r, i) => (
                        <div key={i} className="flex gap-2">
                          <input className="flex-1 bg-zinc-800 p-3 rounded-xl border border-zinc-700 text-sm" value={r} onChange={(e) => {
                            const nr = [...tempAthlete.clinicalRestrictions];
                            nr[i] = e.target.value;
                            updateTemp({ clinicalRestrictions: nr });
                          }} />
                          <button type="button" onClick={() => {
                            const nr = [...tempAthlete.clinicalRestrictions];
                            nr.splice(i, 1);
                            updateTemp({ clinicalRestrictions: nr });
                          }} className="p-3 bg-zinc-800 text-red-500 rounded-xl hover:bg-red-500/10">✕</button>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 mb-2">Mapeamento de Substituições</p>
                    <div className="space-y-2">
                      {tempAthlete?.prohibitedSubstitutions.map((s, i) => (
                        <div key={i} className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700 grid grid-cols-3 gap-2 relative group">
                           <input placeholder="Original" className="bg-zinc-900 p-2 rounded-lg text-[10px] border border-zinc-700" value={s.original} onChange={(e) => {
                             const ns = [...tempAthlete.prohibitedSubstitutions];
                             ns[i].original = e.target.value;
                             updateTemp({ prohibitedSubstitutions: ns });
                           }} />
                           <input placeholder="Elite" className="bg-zinc-900 p-2 rounded-lg text-[10px] border border-zinc-700" value={s.elite} onChange={(e) => {
                             const ns = [...tempAthlete.prohibitedSubstitutions];
                             ns[i].elite = e.target.value;
                             updateTemp({ prohibitedSubstitutions: ns });
                           }} />
                           <input placeholder="Proteção" className="bg-zinc-900 p-2 rounded-lg text-[10px] border border-zinc-700" value={s.protection} onChange={(e) => {
                             const ns = [...tempAthlete.prohibitedSubstitutions];
                             ns[i].protection = e.target.value;
                             updateTemp({ prohibitedSubstitutions: ns });
                           }} />
                           <button type="button" onClick={() => {
                             const ns = [...tempAthlete.prohibitedSubstitutions];
                             ns.splice(i, 1);
                             updateTemp({ prohibitedSubstitutions: ns });
                           }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px]">✕</button>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </section>

            {/* Seção 3: Macros & Nutrição */}
            <section className="space-y-8">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                <span className="w-1 h-4 bg-purple-500 rounded"></span> Nutrição & Suplementação
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {tempAthlete?.macros.map((m, i) => (
                   <div key={i} className="bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700 space-y-4">
                      <p className="text-[10px] font-black uppercase text-zinc-500">{m.label}</p>
                      <input className="w-full bg-zinc-900 p-2 rounded-lg text-xs" placeholder="Grama (ex: 200g)" value={m.grams} onChange={(e) => {
                        const nm = [...tempAthlete.macros];
                        nm[i].grams = e.target.value;
                        updateTemp({ macros: nm });
                      }} />
                      <input className="w-full bg-zinc-900 p-2 rounded-lg text-xs" placeholder="Porcentagem (ex: 30%)" value={m.percentage} onChange={(e) => {
                        const nm = [...tempAthlete.macros];
                        nm[i].percentage = e.target.value;
                        updateTemp({ macros: nm });
                      }} />
                   </div>
                 ))}
              </div>
            </section>

            {/* Seção 4: Cronograma de Treinos */}
            <section className="space-y-8">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1 h-4 bg-green-500 rounded"></span> Estrutura de Treinamento
                </h4>
                <div className="flex items-center gap-6">
                   <button type="button" onClick={handleToggleScheduleType} className="px-4 py-2 bg-zinc-800 rounded-xl text-[10px] font-black uppercase border border-zinc-700 text-amber-500">Alternar Tipo: {tempAthlete?.scheduleType}</button>
                </div>
              </div>

              <div className="space-y-8">
                {tempAthlete?.weeklySchedule.map((day, dIdx) => (
                  <div key={dIdx} className="bg-zinc-800/30 border border-zinc-700/50 rounded-3xl p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <input className="bg-zinc-900 p-3 rounded-xl border border-zinc-700 text-amber-500 font-black uppercase text-xs" value={day.day} onChange={(e) => {
                         const ns = [...tempAthlete.weeklySchedule];
                         ns[dIdx].day = e.target.value;
                         updateTemp({ weeklySchedule: ns });
                       }} />
                       <input className="bg-zinc-900 p-3 rounded-xl border border-zinc-700 text-white font-bold text-xs" placeholder="Foco (ex: Peito/Ombro)" value={day.focus} onChange={(e) => {
                         const ns = [...tempAthlete.weeklySchedule];
                         ns[dIdx].focus = e.target.value;
                         updateTemp({ weeklySchedule: ns });
                       }} />
                       <input className="bg-zinc-900 p-3 rounded-xl border border-zinc-700 text-zinc-400 text-xs" placeholder="Grupos Musculares" value={day.groups} onChange={(e) => {
                         const ns = [...tempAthlete.weeklySchedule];
                         ns[dIdx].groups = e.target.value;
                         updateTemp({ weeklySchedule: ns });
                       }} />
                       <input className="bg-zinc-900 p-3 rounded-xl border border-zinc-700 text-zinc-400 text-xs" placeholder="Intensidade" value={day.intensity} onChange={(e) => {
                         const ns = [...tempAthlete.weeklySchedule];
                         ns[dIdx].intensity = e.target.value;
                         updateTemp({ weeklySchedule: ns });
                       }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {day.exercises?.map((ex, eIdx) => (
                         <div key={eIdx} className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                            <input className="w-full bg-zinc-800 p-2 rounded-lg text-[10px] font-bold" placeholder="Exercício" value={ex.name} onChange={(e) => updateExerciseField(dIdx, eIdx, 'name', e.target.value)} />
                            <input className="w-full bg-zinc-800 p-2 rounded-lg text-[10px]" placeholder="Sets/Reps" value={ex.sets} onChange={(e) => updateExerciseField(dIdx, eIdx, 'sets', e.target.value)} />
                            <input className="w-full bg-zinc-800 p-2 rounded-lg text-[10px]" placeholder="URL Imagem" value={ex.executionImages?.[0] || ''} onChange={(e) => updateExerciseField(dIdx, eIdx, 'executionImages', e.target.value)} />
                         </div>
                       ))}
                       <button type="button" onClick={() => handleAddExercise(dIdx)} className="border border-dashed border-zinc-700 p-4 rounded-xl text-[10px] text-zinc-600 hover:text-amber-500 transition-all">+ Add Exercício</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button type="submit" className="w-full py-6 bg-amber-500 text-black font-black uppercase tracking-widest text-lg rounded-[2rem] shadow-2xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all">
               {isAddingNew ? 'CONFIRMAR RECRUTAMENTO DO ATLETA' : 'SALVAR TODAS AS ALTERAÇÕES'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
