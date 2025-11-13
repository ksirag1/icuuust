import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

// Building coordinates (latitude, longitude)
const BUILDINGS = [
  {
    id: 1,
    name: 'Building 1',
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
    name: 'Building 2',
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
    name: 'Building 3',
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
    name: 'Building 4',
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
    name: 'Building 5',
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
    name: 'Building 6',
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
    name: 'Building 7',
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
    name: 'Building 8',
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
    name: 'Building 9',
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

interface CampusMapProps {
  onBuildingSelect?: (buildingId: number) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({ onBuildingSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const buildingMarkers = useRef<Map<number, L.Marker>>(new Map());

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

    // Create custom icon for buildings
    const buildingIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIGZpbGw9IiMzYjgyZjYiIHJ4PSIyIi8+PHJlY3QgeD0iNiIgeT0iMTAiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjEzIiB5PSIxMCIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjEwIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSI2IiB5PSIxNyIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMTMiIHk9IjE3IiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSIyMCIgeT0iMTciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add building markers
    BUILDINGS.forEach((building) => {
      const marker = L.marker(building.center as [number, number], {
        icon: buildingIcon,
        title: building.name,
      })
        .bindPopup(`<strong>${building.name}</strong><br/><small>Click to view details</small>`)
        .addTo(map.current!);

      marker.on('click', () => {
        onBuildingSelect?.(building.id);
      });

      buildingMarkers.current.set(building.id, marker);
    });

    // Draw building polygons (optional visual aid)
    BUILDINGS.forEach((building) => {
      if (building.bounds.length > 0) {
        const polygon = L.polygon(building.bounds as L.LatLngExpression[], {
          color: '#3b82f6',
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.15,
        }).addTo(map.current!);

        // Add click handler to polygon
        polygon.on('click', () => {
          onBuildingSelect?.(building.id);
        });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [onBuildingSelect]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

interface BuildingMapProps {
  buildingId: number;
  onBack: () => void;
}

export const BuildingMap: React.FC<BuildingMapProps> = ({ buildingId, onBack }) => {
  const building = BUILDINGS.find((b) => b.id === buildingId);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !building) return;

    // Initialize map centered on the building
    map.current = L.map(mapContainer.current, {
      center: building.center as [number, number],
      zoom: 19,
      minZoom: 18,
      maxZoom: 20,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map.current);

    // Draw building polygon with improved styling
    if (building.bounds.length > 0) {
      const polygon = L.polygon(building.bounds as L.LatLngExpression[], {
        color: '#ef4444',
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.25,
      }).addTo(map.current);

      // Add hover effect
      polygon.on('mouseover', function (this: L.Polygon) {
        this.setStyle({ fillOpacity: 0.4 });
      });
      polygon.on('mouseout', function (this: L.Polygon) {
        this.setStyle({ fillOpacity: 0.25 });
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [building]);

  if (!building) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Building not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Campus
          </Button>
          <h2 className="text-lg font-semibold text-gray-800">{building.name}</h2>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1">
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        <div className="w-56 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Select Floor</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5].map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedFloor(floor);
                    setSelectedRoom(null);
                  }}
                  className="text-xs font-semibold"
                >
                  {floor}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">
              Floor {selectedFloor} Rooms
            </h3>
            <div className="space-y-2">
              {[...Array(12)].map((_, i) => {
                const roomId = i + 1;
                const roomNumber = `${selectedFloor}${String(i + 1).padStart(2, '0')}`;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedRoom(roomId)}
                    className={`p-3 rounded border-2 text-sm font-medium cursor-pointer transition-all ${
                      selectedRoom === roomId
                        ? 'bg-blue-50 border-blue-500 text-blue-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="font-semibold">Room {roomNumber}</div>
                    <div className="text-xs text-gray-500 mt-1">Auditorium</div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedRoom && (
            <div className="p-4 border-t bg-blue-50">
              <div className="text-xs text-gray-600 mb-2">Selected Room:</div>
              <div className="font-bold text-lg text-blue-900">
                {selectedFloor}{String(selectedRoom).padStart(2, '0')}
              </div>
              <Button
                size="sm"
                className="w-full mt-3"
                onClick={() => setSelectedRoom(null)}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
