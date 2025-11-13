import { useState } from 'react';
import { CampusMap, BuildingMap } from '@/components/CampusMap';

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);

  return (
    <div className="w-screen h-screen bg-gray-100">
      {selectedBuilding === null ? (
        <div className="w-full h-full flex flex-col">
          <div className="bg-white border-b p-4 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">UUST IUM Interactive Map</h1>
            <p className="text-sm text-gray-600 mt-1">
              Click on a building to view its details and rooms
            </p>
          </div>
          <div className="flex-1">
            <CampusMap onBuildingSelect={setSelectedBuilding} />
          </div>
        </div>
      ) : (
        <BuildingMap buildingId={selectedBuilding} onBack={() => setSelectedBuilding(null)} />
      )}
    </div>
  );
}
