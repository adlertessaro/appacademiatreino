
import React, { useState, useEffect } from 'react';
import { USERS } from './constants';
import { UserPlan } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from '../src/supabaseClient';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserPlan[]>(() => {
    const saved = localStorage.getItem('elite-hub-users');
    return saved ? JSON.parse(saved) : USERS;
  });
  
  const [currentUser, setCurrentUser] = useState<UserPlan | null>(null);

  useEffect(() => {
    localStorage.setItem('elite-hub-users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Adicione um novo estado para gerenciar as múltiplas unidades
const [pendingUnits, setPendingUnits] = useState<any[] | null>(null);

const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (cpf: string) => {

  setIsLoading(true); // Ativa o spinner assim que o usuário clica

  try {
    // Chamamos o SEU servidor Fastify em vez do Supabase direto
    const response = await fetch('http://localhost:3333/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf })
    });

    const result = await response.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    if (result.multipleUnits) {
      // Se houver mais de uma, guardamos para mostrar a tela de seleção
      setPendingUnits(result.units);
    } else {
      // Se houver apenas uma, entramos direto
      setCurrentUser(result.profile);
      // Aqui você também guardará os dados da academia para o White Label
      console.log("Academia Ativa:", result.unit.academia);
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor.");
    } finally {
    setIsLoading(false); // Desativa o spinner em caso de erro
  }
};

  const handleLogout = () => setCurrentUser(null);

  const updateUser = (updatedUser: UserPlan) => {
    setAllUsers(prev => {
      const exists = prev.find(u => u.id === updatedUser.id);
      if (exists) {
        return prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      } else {
        return [...prev, updatedUser];
      }
    });
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="flex-1">
        {!currentUser ? (
          <Login onLogin={handleLogin} isLoading={isLoading} />
        ) : currentUser.isAdmin ? (
          <AdminDashboard users={allUsers} onUpdateUser={updateUser} onLogout={handleLogout} />
        ) : (
          <Dashboard user={currentUser} onUpdateUser={updateUser} onLogout={handleLogout} />
        )}
      </div>
      <footer className="py-8 bg-black border-t border-zinc-900 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold px-4">
          Desenvolvido para sua saúde pela <a href="https://tessarolabs.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-amber-500 transition-colors">Tessaro Labs</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
