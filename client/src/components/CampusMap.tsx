import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit2 } from 'lucide-react';
import { PolygonEditor } from './PolygonEditor';
import { BuildingConstructor } from './BuildingConstructor';
import { FloorPlanViewer } from './FloorPlanViewer';

interface Element {
  id: string;
  name: string;
  type: 'room' | 'auditorium' | 'stairs' | 'corridor' | 'toilet' | 'utility' | 'office';
  x: number;
  y: number;
  width: number;
  height: number;
  floor: number;
}

interface Building {
  id: number;
  name: string;
  center: [number, number];
  bounds: [number, number][];
}

// Initial building coordinates
const INITIAL_BUILDINGS: Building[] = [
  {
    id: 1,
    name: 'Корпус 1',
    center: [54.724380444948956, 55.942002948239704],
    bounds: [
      [54.724380444948956, 55.942002948239704],
      [54.72426648367723, 55.94272727177099],
      [54.72543093351181, 55.94329280193654],
      [54.72554355082898, 55.94256151375592],
    ],
  },
  {
    id: 2,
    name: 'Корпус 2',
    center: [54.72414036513734, 55.942659939326916],
    bounds: [
      [54.72414036513734, 55.942659939326916],
      [54.7239561922554, 55.94255550403219],
      [54.72410799588229, 55.94147725604961],
      [54.72377108400487, 55.941281454805925],
      [54.72382419052338, 55.94103035401626],
      [54.72417194504313, 55.94117921659328],
      [54.72424242499621, 55.94072994659423],
      [54.72443682510498, 55.94081980060167],
    ],
  },
  {
    id: 3,
    name: 'Корпус 3',
    center: [54.723436349476145, 55.9423219101881],
    bounds: [
      [54.723436349476145, 55.9423219101881],
      [54.72371510098906, 55.94073181104349],
      [54.723609592464314, 55.94068219092835],
      [54.723500175926354, 55.94117388116029],
      [54.723085953499826, 55.94099569983771],
      [54.72291401087198, 55.94212117426772],
    ],
  },
  {
    id: 4,
    name: 'Корпус 4',
    center: [54.72372682414613, 55.94070700093012],
    bounds: [
      [54.72372682414613, 55.94070700093012],
      [54.72361350019695, 55.940659636274745],
      [54.72365257745659, 55.94040702477944],
      [54.72337512809732, 55.940271697192664],
      [54.72325529022809, 55.941061108115505],
      [54.72308595349873, 55.940991188868665],
      [54.72326961868191, 55.93994691099073],
      [54.72376980900378, 55.94015892421],
    ],
  },
  {
    id: 5,
    name: 'Корпус 5',
    center: [54.72379325528604, 55.94018373425545],
    bounds: [
      [54.72379325528604, 55.94018373425545],
      [54.7237672038742, 55.94045213396922],
      [54.7241905372416, 55.94070023454498],
      [54.724240034392764, 55.940388981095396],
    ],
  },
  {
    id: 6,
    name: 'Корпус 6',
    center: [54.72424394207344, 55.940745343761485],
    bounds: [
      [54.72424394207344, 55.940745343761485],
      [54.72479882699854, 55.94102727623393],
      [54.724759750843994, 55.94130244232704],
      [54.72499029961114, 55.94141747077579],
      [54.72508798937111, 55.940831051233104],
      [54.72428562383405, 55.94046341128904],
    ],
  },
  {
    id: 7,
    name: 'Корпус 7',
    center: [54.72527241033724, 55.941543432471406],
    bounds: [
      [54.72527241033724, 55.941543432471406],
      [54.725362284299514, 55.940984078446064],
      [54.726331347420334, 55.941432914966136],
      [54.726277945352365, 55.94166748278321],
      [54.72557459446741, 55.941335930187144],
      [54.72551467882857, 55.94166297185519],
    ],
  },
  {
    id: 8,
    name: 'Корпус 8',
    center: [54.7255, 55.9420],
    bounds: [
      [54.7255, 55.9420],
      [54.7256, 55.9420],
      [54.7256, 55.9421],
      [54.7255, 55.9421],
    ],
  },
  {
    id: 9,
    name: 'Корпус 9',
    center: [54.7260, 55.9425],
    bounds: [
      [54.7260, 55.9425],
      [54.7261, 55.9425],
      [54.7261, 55.9426],
      [54.7260, 55.9426],
    ],
  },
];

// Campus bounds (corners of the campus)
const CAMPUS_BOUNDS = L.latLngBounds(
  [54.72284087510038, 55.942177752421244], // Southwest
  [54.72658575327742, 55.94390778418403] // Northeast
);

const CAMPUS_CENTER = [54.7247, 55.9430] as [number, number];

// Mock storage for building layouts
const buildingLayouts: Record<number, Element[]> = {
  1: [
    {
      id: '1',
      name: 'Кабинет 101',
      type: 'room',
      x: 50,
      y: 50,
      width: 100,
      height: 80,
      floor: 1,
    },
    {
      id: '2',
      name: 'Лестница',
      type: 'stairs',
      x: 200,
      y: 100,
      width: 60,
      height: 80,
      floor: 1,
    },
    {
      id: '3',
      name: 'Аудитория 102',
      type: 'auditorium',
      x: 350,
      y: 50,
      width: 150,
      height: 120,
      floor: 1,
    },
  ],
};

// Storage functions
const STORAGE_KEY = 'iku_uunit_buildings';

const loadBuildingsFromStorage = (): Building[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load buildings from storage:', e);
  }
  return INITIAL_BUILDINGS;
};

const saveBuildingsToStorage = (buildings: Building[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildings));
  } catch (e) {
    console.error('Failed to save buildings to storage:', e);
  }
};

interface CampusMapProps {
  onBuildingSelect?: (buildingId: number) => void;
  isAdmin?: boolean;
}

export const CampusMap: React.FC<CampusMapProps> = ({ onBuildingSelect, isAdmin = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const buildingMarkers = useRef<Map<number, L.Marker>>(new Map());
  const polygons = useRef<Map<number, L.Polygon>>(new Map());
  const [buildings, setBuildings] = useState<Building[]>(() => loadBuildingsFromStorage());
  const [editingPolygonBuildingId, setEditingPolygonBuildingId] = useState<number | null>(null);
  const [viewingBuildingId, setViewingBuildingId] = useState<number | null>(null);

  // Save buildings to localStorage whenever they change
  useEffect(() => {
    saveBuildingsToStorage(buildings);
  }, [buildings]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: CAMPUS_CENTER,
      zoom: 18,
      maxBounds: CAMPUS_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 17,
      maxZoom: 20,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map when buildings change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers and polygons
    buildingMarkers.current.forEach((marker) => marker.remove());
    polygons.current.forEach((polygon) => polygon.remove());
    buildingMarkers.current.clear();
    polygons.current.clear();

    // Create custom icon for buildings
    const buildingIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIGZpbGw9IiMxQjQ5NjUiIHJ4PSIyIi8+PHJlY3QgeD0iNiIgeT0iMTAiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjEzIiB5PSIxMCIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjEwIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSI2IiB5PSIxNyIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMTMiIHk9IjE3IiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSIyMCIgeT0iMTciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add building markers and polygons
    buildings.forEach((building) => {
      const marker = L.marker(building.center as [number, number], {
        icon: buildingIcon,
        title: building.name,
      })
        .bindPopup(`<strong>${building.name}</strong><br/><small>Нажмите для ${isAdmin ? 'редактирования' : 'просмотра'}</small>`)
        .addTo(map.current!);

      marker.on('click', () => {
        setViewingBuildingId(building.id);
      });

      buildingMarkers.current.set(building.id, marker);

      // Draw building polygons
      if (building.bounds.length > 0) {
        const polygon = L.polygon(building.bounds as L.LatLngExpression[], {
          color: '#1B4965',
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.15,
        }).addTo(map.current!);

        // Add click handler to polygon
        polygon.on('click', () => {
          setViewingBuildingId(building.id);
        });

        polygons.current.set(building.id, polygon);
      }
    });
  }, [buildings, isAdmin]);

  // Polygon editor mode
  if (editingPolygonBuildingId !== null && isAdmin) {
    const building = buildings.find((b) => b.id === editingPolygonBuildingId);
    if (building) {
      return (
        <PolygonEditor
          buildingId={building.id}
          buildingName={building.name}
          initialCoordinates={building.bounds as [number, number][]}
          onSave={(coords) => {
            // Update building with new coordinates
            setBuildings(
              buildings.map((b) =>
                b.id === building.id ? { ...b, bounds: coords } : b
              )
            );
            setEditingPolygonBuildingId(null);
          }}
          onCancel={() => setEditingPolygonBuildingId(null)}
        />
      );
    }
  }

  // Building view mode (admin or user)
  if (viewingBuildingId !== null) {
    const building = buildings.find((b) => b.id === viewingBuildingId);
    if (building) {
      return (
        <BuildingView
          building={building}
          isAdmin={isAdmin}
          onBack={() => setViewingBuildingId(null)}
          onEditPolygon={() => {
            setViewingBuildingId(null);
            setEditingPolygonBuildingId(building.id);
          }}
        />
      );
    }
  }

  // Campus map view
  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      {isAdmin && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-700 max-w-xs border-l-4 border-[#1B4965]">
          <p className="font-semibold mb-2 text-[#1B4965]">Режим администратора</p>
          <p>Нажмите на корпус для редактирования или просмотра макета</p>
        </div>
      )}
    </div>
  );
};

interface BuildingViewProps {
  building: Building;
  isAdmin: boolean;
  onBack: () => void;
  onEditPolygon: () => void;
}

const BuildingView: React.FC<BuildingViewProps> = ({
  building,
  isAdmin,
  onBack,
  onEditPolygon,
}) => {
  const [showConstructor, setShowConstructor] = useState(false);
  const [elements, setElements] = useState<Element[]>(buildingLayouts[building.id] || []);

  if (showConstructor && isAdmin) {
    return (
      <BuildingConstructor
        buildingId={building.id}
        buildingName={building.name}
        initialElements={elements}
        onSave={(newElements) => {
          setElements(newElements);
          buildingLayouts[building.id] = newElements;
          setShowConstructor(false);
        }}
        onClose={() => setShowConstructor(false)}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#B8D4E8]">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm flex items-center justify-between border-b-4 border-[#1B4965]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-[#B8D4E8]"
          >
            <ChevronLeft className="w-4 h-4" />
            На карту кампуса
          </Button>
          <h2 className="text-lg font-semibold text-[#1B4965]">{building.name}</h2>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEditPolygon}
              className="flex items-center gap-2 border-[#1B4965] text-[#1B4965] hover:bg-[#B8D4E8]"
            >
              Редактировать границы
            </Button>
            <Button
              size="sm"
              onClick={() => setShowConstructor(true)}
              className="flex items-center gap-2 bg-[#1B4965] hover:bg-[#0d2a3f]"
            >
              <Edit2 className="w-4 h-4" />
              Редактировать макет
            </Button>
          </div>
        )}
      </div>

      {/* Floor Plan Viewer */}
      <div className="flex-1">
        {elements.length > 0 ? (
          <FloorPlanViewer
            buildingName={building.name}
            elements={elements}
            onBack={onBack}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Макет этажа еще не создан</p>
              {isAdmin && (
                <Button
                  onClick={() => setShowConstructor(true)}
                  className="bg-[#1B4965] hover:bg-[#0d2a3f]"
                >
                  Создать макет
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
