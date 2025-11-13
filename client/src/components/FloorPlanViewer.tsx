import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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

interface FloorPlanViewerProps {
  buildingName: string;
  elements: Element[];
  onBack: () => void;
}

const ELEMENT_COLORS: Record<Element['type'], string> = {
  room: '#e0f2fe',
  auditorium: '#fef3c7',
  stairs: '#f3e8ff',
  corridor: '#e0e7ff',
  toilet: '#fce7f3',
  utility: '#f0fdf4',
  office: '#fef2f2',
};

const ELEMENT_BORDERS: Record<Element['type'], string> = {
  room: '#0284c7',
  auditorium: '#d97706',
  stairs: '#7c3aed',
  corridor: '#4f46e5',
  toilet: '#ec4899',
  utility: '#16a34a',
  office: '#dc2626',
};

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  buildingName,
  elements,
  onBack,
}) => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const gridSize = 20;

  const currentElements = elements.filter((el) => el.floor === selectedFloor);
  const allFloors = Array.from(new Set(elements.map((el) => el.floor))).sort();

  const renderStairs = (x: number, y: number, width: number, height: number) => {
    const steps = Math.min(Math.floor(width / 10), Math.floor(height / 10));
    const stepWidth = width / steps;
    const stepHeight = height / steps;

    return (
      <svg
        x={x}
        y={y}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute"
        style={{ pointerEvents: 'none' }}
      >
        {/* Background */}
        <rect width={width} height={height} fill={ELEMENT_COLORS.stairs} />

        {/* Stair pattern */}
        {Array.from({ length: steps }).map((_, i) => (
          <g key={i}>
            <line
              x1={i * stepWidth}
              y1={height}
              x2={i * stepWidth}
              y2={height - (i + 1) * stepHeight}
              stroke={ELEMENT_BORDERS.stairs}
              strokeWidth="2"
            />
            <line
              x1={i * stepWidth}
              y1={height - (i + 1) * stepHeight}
              x2={(i + 1) * stepWidth}
              y2={height - (i + 1) * stepHeight}
              stroke={ELEMENT_BORDERS.stairs}
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Border */}
        <rect
          width={width}
          height={height}
          fill="none"
          stroke={ELEMENT_BORDERS.stairs}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
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
          <h2 className="text-lg font-semibold text-gray-800">{buildingName} - Floor Plan</h2>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Floor Selector */}
        <div className="w-40 bg-white rounded-lg shadow p-4 flex flex-col">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Floors</h3>
          {allFloors.length > 0 ? (
            <div className="space-y-2">
              {allFloors.map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedFloor(floor);
                    setSelectedElement(null);
                  }}
                  className="w-full justify-start"
                >
                  Floor {floor}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No floors available</p>
          )}
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-auto flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-sm">
              Floor {selectedFloor} ({currentElements.length} elements)
            </h3>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div
              className="relative bg-white border-2 border-gray-300 rounded"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(200,200,200,.05) 25%, rgba(200,200,200,.05) 26%, transparent 27%, transparent 74%, rgba(200,200,200,.05) 75%, rgba(200,200,200,.05) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(200,200,200,.05) 25%, rgba(200,200,200,.05) 26%, transparent 27%, transparent 74%, rgba(200,200,200,.05) 75%, rgba(200,200,200,.05) 76%, transparent 77%, transparent)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            >
              {/* Elements */}
              {currentElements.map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedElement(el.id)}
                  className={`absolute border-2 flex items-center justify-center text-xs font-semibold cursor-pointer transition ${
                    selectedElement === el.id ? 'ring-2 ring-blue-500 z-10' : ''
                  }`}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    backgroundColor: ELEMENT_COLORS[el.type],
                    borderColor: ELEMENT_BORDERS[el.type],
                  }}
                >
                  {el.type === 'stairs' ? (
                    renderStairs(0, 0, el.width, el.height)
                  ) : (
                    <span className="text-center px-1 break-words">{el.name}</span>
                  )}
                </div>
              ))}

              {currentElements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <p>No elements on this floor</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Element Details */}
        {selectedElement && (
          <div className="w-56 bg-white rounded-lg shadow p-4 flex flex-col">
            {(() => {
              const el = currentElements.find((e) => e.id === selectedElement);
              if (!el) return null;

              return (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Element</p>
                    <h4 className="font-bold text-lg text-gray-800">{el.name}</h4>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-semibold text-sm capitalize">{el.type}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Width</p>
                        <p className="font-semibold text-sm">{el.width}px</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Height</p>
                        <p className="font-semibold text-sm">{el.height}px</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="w-full h-12 rounded border-2"
                    style={{
                      backgroundColor: ELEMENT_COLORS[el.type],
                      borderColor: ELEMENT_BORDERS[el.type],
                    }}
                  ></div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedElement(null)}
                  >
                    Clear Selection
                  </Button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
