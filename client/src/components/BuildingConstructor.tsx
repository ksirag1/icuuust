import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Save } from 'lucide-react';

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

interface BuildingConstructorProps {
  buildingId: number;
  buildingName: string;
  initialElements?: Element[];
  onSave: (elements: Element[]) => void;
  onClose: () => void;
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

export const BuildingConstructor: React.FC<BuildingConstructorProps> = ({
  buildingId,
  buildingName,
  initialElements = [],
  onSave,
  onClose,
}) => {
  const [elements, setElements] = useState<Element[]>(initialElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [gridSize] = useState(20);
  const [elementForm, setElementForm] = useState({
    name: '',
    type: 'room' as Element['type'],
    width: 100,
    height: 100,
  });

  const canvasWidth = 800;
  const canvasHeight = 600;

  const addElement = () => {
    if (!elementForm.name.trim()) {
      alert('Please enter element name');
      return;
    }

    const newElement: Element = {
      id: `${Date.now()}`,
      name: elementForm.name,
      type: elementForm.type,
      x: 50,
      y: 50,
      width: elementForm.width,
      height: elementForm.height,
      floor: currentFloor,
    };

    setElements([...elements, newElement]);
    setElementForm({ name: '', type: 'room', width: 100, height: 100 });
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const handleCanvasDrag = (e: React.DragEvent, elementId: string) => {
    const canvas = e.currentTarget as HTMLDivElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, canvasWidth - 50));
    const y = Math.max(0, Math.min(e.clientY - rect.top, canvasHeight - 50));

    updateElement(elementId, {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    });
  };

  const currentElements = elements.filter((el) => el.floor === currentFloor);

  const handleSave = () => {
    onSave(elements);
  };

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
        <rect width={width} height={height} fill={ELEMENT_COLORS.stairs} />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Building Constructor - {buildingName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Left Panel - Controls */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto">
            {/* Floor Selector */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Floor</h3>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((floor) => (
                  <Button
                    key={floor}
                    variant={currentFloor === floor ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentFloor(floor)}
                    className="text-xs"
                  >
                    {floor}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add Element Form */}
            <div className="border rounded-lg p-3 space-y-3">
              <h3 className="font-semibold text-sm">Add Element</h3>

              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={elementForm.name}
                  onChange={(e) =>
                    setElementForm({ ...elementForm, name: e.target.value })
                  }
                  placeholder="e.g., Room 101"
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Type</label>
                <select
                  value={elementForm.type}
                  onChange={(e) =>
                    setElementForm({
                      ...elementForm,
                      type: e.target.value as Element['type'],
                    })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="room">Room</option>
                  <option value="auditorium">Auditorium</option>
                  <option value="stairs">Stairs</option>
                  <option value="corridor">Corridor</option>
                  <option value="toilet">Toilet</option>
                  <option value="utility">Utility</option>
                  <option value="office">Office</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Width</label>
                  <input
                    type="number"
                    value={elementForm.width}
                    onChange={(e) =>
                      setElementForm({
                        ...elementForm,
                        width: parseInt(e.target.value) || 100,
                      })
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Height</label>
                  <input
                    type="number"
                    value={elementForm.height}
                    onChange={(e) =>
                      setElementForm({
                        ...elementForm,
                        height: parseInt(e.target.value) || 100,
                      })
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>

              <Button onClick={addElement} className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Element
              </Button>
            </div>

            {/* Elements List */}
            <div>
              <h3 className="font-semibold text-sm mb-2">
                Elements ({currentElements.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentElements.map((el) => (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElement(el.id)}
                    className={`p-2 rounded text-xs cursor-pointer border-2 transition ${
                      selectedElement === el.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor: ELEMENT_COLORS[el.type],
                          border: `2px solid ${ELEMENT_BORDERS[el.type]}`,
                        }}
                      ></div>
                      <span className="font-semibold">{el.name}</span>
                    </div>
                    <div className="text-gray-600">
                      {el.type} • {el.width}×{el.height}px
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Floor {currentFloor} Layout</h3>
              <span className="text-xs text-gray-600">Grid: {gridSize}px</span>
            </div>

            <div
              className="flex-1 border-2 border-gray-300 rounded-lg bg-white overflow-auto relative"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(200,200,200,.05) 25%, rgba(200,200,200,.05) 26%, transparent 27%, transparent 74%, rgba(200,200,200,.05) 75%, rgba(200,200,200,.05) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(200,200,200,.05) 25%, rgba(200,200,200,.05) 26%, transparent 27%, transparent 74%, rgba(200,200,200,.05) 75%, rgba(200,200,200,.05) 76%, transparent 77%, transparent)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            >
              <div
                className="relative"
                style={{
                  width: canvasWidth,
                  height: canvasHeight,
                }}
              >
                {/* Elements */}
                {currentElements.map((el) => (
                  <div
                    key={el.id}
                    draggable
                    onDragEnd={(e) => handleCanvasDrag(e, el.id)}
                    onClick={() => setSelectedElement(el.id)}
                    className={`absolute cursor-move border-2 flex items-center justify-center text-xs font-semibold transition ${
                      selectedElement === el.id ? 'ring-2 ring-blue-500' : ''
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
              </div>
            </div>

            {/* Element Editor */}
            {selectedElement && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                {(() => {
                  const el = currentElements.find((e) => e.id === selectedElement);
                  if (!el) return null;

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{el.name}</h4>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteElement(el.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block font-medium mb-1">X</label>
                          <input
                            type="number"
                            value={el.x}
                            onChange={(e) =>
                              updateElement(el.id, {
                                x: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Y</label>
                          <input
                            type="number"
                            value={el.y}
                            onChange={(e) =>
                              updateElement(el.id, {
                                y: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Width</label>
                          <input
                            type="number"
                            value={el.width}
                            onChange={(e) =>
                              updateElement(el.id, {
                                width: parseInt(e.target.value) || 50,
                              })
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Height</label>
                          <input
                            type="number"
                            value={el.height}
                            onChange={(e) =>
                              updateElement(el.id, {
                                height: parseInt(e.target.value) || 50,
                              })
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Layout
          </Button>
        </div>
      </div>
    </div>
  );
};
