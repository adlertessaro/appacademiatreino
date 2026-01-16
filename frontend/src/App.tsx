
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

  const handleLogin = async (cpf: string) => {
    // Primeiro, limpamos o CPF que veio do usuário
    const cleanedCpf = cpf.replace(/\D/g, ''); 

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('cpf', cleanedCpf)
      .single();

    if (error || !data) {
      alert("Usuário não encontrado no sistema ❌");
    } else {
      setCurrentUser(data); // Define o usuário vindo do banco!
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
          <Login onLogin={handleLogin} />
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
