import React, { useState } from 'react';
import UserCircleIcon from './icons/UserCircleIcon';
import LockClosedIcon from './icons/LockClosedIcon';

interface LoginProps {
  onLogin: (user: string, pass: string) => boolean;
  onBackToClient: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBackToClient }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acesso Administrativo</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuário</label>
                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2"
                            placeholder="admin"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">Senha</label>
                     <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                        Entrar
                    </button>
                </div>
            </form>
             <button onClick={onBackToClient} className="mt-4 text-sm text-center w-full text-violet-600 hover:text-violet-800">
                Voltar para o site
             </button>
        </div>
    </div>
  );
};

export default Login;