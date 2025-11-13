import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface PolygonEditorProps {
  buildingId: number;
  buildingName: string;
  initialCoordinates: [number, number][];
  onSave: (coordinates: [number, number][]) => void;
  onCancel: () => void;
}

const CAMPUS_BOUNDS = L.latLngBounds(
  [54.72284087510038, 55.942177752421244],
  [54.72658575327742, 55.94390778418403]
);

const CAMPUS_CENTER = [54.7247, 55.9430] as [number, number];

export const PolygonEditor: React.FC<PolygonEditorProps> = ({
  buildingId,
  buildingName,
  initialCoordinates,
  onSave,
  onCancel,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const polygon = useRef<L.Polygon | null>(null);
  const markers = useRef<Map<number, L.Marker>>(new Map());
  const [coordinates, setCoordinates] = useState<[number, number][]>(initialCoordinates);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current, {
      center: CAMPUS_CENTER,
      zoom: 18,
      maxBounds: CAMPUS_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 17,
      maxZoom: 20,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map.current);

    // Draw initial polygon
    if (coordinates.length > 0) {
      polygon.current = L.polygon(coordinates as L.LatLngExpression[], {
        color: '#ef4444',
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.25,
      }).addTo(map.current);

      // Add draggable markers for each vertex
      coordinates.forEach((coord, index) => {
        addMarker(index, coord);
      });
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const addMarker = (index: number, coord: [number, number]) => {
    if (!map.current) return;

    const marker = L.marker(coord as L.LatLngExpression, {
      draggable: true,
      title: `Vertex ${index + 1}`,
    })
      .addTo(map.current)
      .on('drag', (e) => {
        const newLat = (e.target as L.Marker).getLatLng().lat;
        const newLng = (e.target as L.Marker).getLatLng().lng;
        updateCoordinate(index, [newLat, newLng]);
      })
      .on('click', () => {
        setEditingIndex(index);
      });

    markers.current.set(index, marker);
  };

  const updateCoordinate = (index: number, newCoord: [number, number]) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index] = newCoord;
    setCoordinates(newCoordinates);

    // Update polygon
    if (polygon.current && map.current) {
      polygon.current.setLatLngs(newCoordinates as L.LatLngExpression[]);
    }

    // Update marker
    const marker = markers.current.get(index);
    if (marker) {
      marker.setLatLng(newCoord);
    }
  };

  const handleAddVertex = () => {
    if (coordinates.length === 0) {
      const newCoord: [number, number] = [CAMPUS_CENTER[0], CAMPUS_CENTER[1]];
      const newCoordinates = [...coordinates, newCoord];
      setCoordinates(newCoordinates);

      if (map.current) {
        addMarker(newCoordinates.length - 1, newCoord);
      }
    } else {
      const lastCoord = coordinates[coordinates.length - 1];
      const newCoord: [number, number] = [
        lastCoord[0] + 0.0001,
        lastCoord[1] + 0.0001,
      ];
      const newCoordinates = [...coordinates, newCoord];
      setCoordinates(newCoordinates);

      if (map.current) {
        addMarker(newCoordinates.length - 1, newCoord);
      }

      // Update polygon
      if (polygon.current) {
        polygon.current.setLatLngs(newCoordinates as L.LatLngExpression[]);
      } else if (map.current) {
        polygon.current = L.polygon(newCoordinates as L.LatLngExpression[], {
          color: '#ef4444',
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.25,
        }).addTo(map.current);
      }
    }
  };

  const handleRemoveVertex = (index: number) => {
    if (coordinates.length <= 3) {
      alert('Polygon must have at least 3 vertices');
      return;
    }

    const newCoordinates = coordinates.filter((_, i) => i !== index);
    setCoordinates(newCoordinates);

    // Remove marker
    const marker = markers.current.get(index);
    if (marker && map.current) {
      map.current.removeLayer(marker);
      markers.current.delete(index);
    }

    // Update polygon
    if (polygon.current) {
      polygon.current.setLatLngs(newCoordinates as L.LatLngExpression[]);
    }

    setEditingIndex(null);
  };

  const handleSave = () => {
    if (coordinates.length < 3) {
      alert('Polygon must have at least 3 vertices');
      return;
    }
    onSave(coordinates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-96 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit {buildingName} Polygon</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Map */}
          <div className="flex-1 rounded-lg overflow-hidden border">
            <div ref={mapContainer} className="w-full h-full" />
          </div>

          {/* Controls */}
          <div className="w-64 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Vertices ({coordinates.length})</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {coordinates.map((coord, index) => (
                  <div
                    key={index}
                    onClick={() => setEditingIndex(index)}
                    className={`p-2 rounded text-xs cursor-pointer transition ${
                      editingIndex === index
                        ? 'bg-blue-100 border border-blue-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-mono">{index + 1}</div>
                    <div className="text-gray-600">
                      {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full"
                onClick={handleAddVertex}
              >
                Add Vertex
              </Button>
              {editingIndex !== null && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleRemoveVertex(editingIndex)}
                >
                  Remove Vertex
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
