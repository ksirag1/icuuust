import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { CampusMap } from '@/components/CampusMap';
import { useAuthLocal } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { role, email, isLoading, isAdmin, logout } = useAuthLocal();

  useEffect(() => {
    if (!isLoading && !role) {
      setLocation('/login');
    }
  }, [role, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#B8D4E8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4965] mx-auto mb-4"></div>
          <p className="text-[#1B4965]">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="w-screen h-screen bg-[#B8D4E8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#1B4965] shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="ИКУ УУНИТ" className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-bold text-[#1B4965]">ИКУ УУНИТ</h1>
            <p className="text-sm text-[#1B4965]">
              {isAdmin ? '👨‍💼 Администратор' : '👤 Пользователь'} • {email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 border-[#1B4965] text-[#1B4965] hover:bg-[#B8D4E8]"
        >
          <LogOut className="w-4 h-4" />
          Выход
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <CampusMap isAdmin={isAdmin} />
      </div>
    </div>
  );
}
