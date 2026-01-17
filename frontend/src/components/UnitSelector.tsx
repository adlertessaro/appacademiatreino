import React from 'react';

interface UnitSelectorProps {
  units: any[];
  onSelect: (unit: any) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ units, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-black text-white text-center uppercase italic">
          Em qual unidade deseja entrar?
        </h2>
        <div className="grid gap-4">
          {units.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-amber-500 transition-all text-left group"
            >
              <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{item.funcao}</p>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-500">{item.academia.nome}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitSelector;