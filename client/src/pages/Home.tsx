import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CampusMap, BuildingMap } from '@/components/CampusMap';
import { useAuthLocal } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { role, email, isLoading, isAdmin, logout } = useAuthLocal();

  useEffect(() => {
    if (!isLoading && !role) {
      setLocation('/login');
    }
  }, [role, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">UUST IUM Interactive Map</h1>
          <p className="text-sm text-gray-600">
            {isAdmin ? '👨‍💼 Admin Mode' : '👤 User Mode'} • {email}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {selectedBuilding === null ? (
          <div className="w-full h-full flex flex-col">
            <div className="bg-white border-b p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                {isAdmin
                  ? 'Click on a building to edit its layout or view details'
                  : 'Click on a building to view its rooms and details'}
              </p>
            </div>
            <div className="flex-1">
              <CampusMap onBuildingSelect={setSelectedBuilding} />
            </div>
          </div>
        ) : (
          <BuildingMap
            buildingId={selectedBuilding}
            onBack={() => setSelectedBuilding(null)}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
}
