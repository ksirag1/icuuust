import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Login() {
  const [email, setEmail] = useState('admin@uust.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (email === 'admin@uust.edu' && password === 'password123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', email);
        setLocation('/');
      } else if (email === 'user@uust.edu' && password === 'password123') {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userEmail', email);
        setLocation('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8D4E8] to-[#1B4965] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="ИКУ УУНИТ" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#1B4965] mb-2">ИКУ УУНИТ</h1>
          <p className="text-gray-600">Умная навигация по университету</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:border-transparent"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:border-transparent"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1B4965] hover:bg-[#0d2a3f] text-white font-semibold py-2 rounded-lg transition"
          >
            {isLoading ? 'Загрузка...' : 'Вход'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-[#B8D4E8] rounded-lg">
          <p className="text-sm font-semibold text-[#1B4965] mb-2">Демо учетные данные:</p>
          <div className="space-y-1 text-xs text-[#1B4965]">
            <p>
              <strong>Администратор:</strong> admin@uust.edu / password123
            </p>
            <p>
              <strong>Пользователь:</strong> user@uust.edu / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
