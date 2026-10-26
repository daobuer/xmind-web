'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  NODE_COLORS,
  type MindMapNodeData,
  createNode,
  updateNode,
  deleteNode,
} from '@/lib/api';
import { MindMapNodeComponent } from './MindMapNode';
import { ConnectionLine } from './ConnectionLine';
import { NodeToolbar } from './NodeToolbar';

interface MindMapCanvasProps {
  nodes: MindMapNodeData[];
  mindMapId: string;
  onNodesChange: (nodes: MindMapNodeData[]) => void;
}

export function MindMapCanvas({ nodes, mindMapId, onNodesChange }: MindMapCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [viewBox, setViewBox] = useState({ x: -100, y: -100, w: 1200, h: 800 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  // Auto-layout: position root at center, children to the right
  const layoutNodes = useCallback(
    (allNodes: MindMapNodeData[]): MindMapNodeData[] => {
      const root = allNodes.find((n) => n.isRoot);
      if (!root) return allNodes;

      const positioned = new Map<string, MindMapNodeData>();
      const rootX = 100;
      const rootY = 300;

      positioned.set(root.id, { ...root, x: rootX, y: rootY });

      const children = allNodes.filter((n) => n.parentId === root.id);
      const spacing = 80;
      const startX = rootX + 220;
      const totalHeight = children.length * spacing;
      const startY = rootY - totalHeight / 2 + spacing / 2;

      children.forEach((child, idx) => {
        positioned.set(child.id, {
          ...child,
          x: startX,
          y: startY + idx * spacing,
        });

        // Position grandchildren
        const grandChildren = allNodes.filter((n) => n.parentId === child.id);
        const gcStartX = startX + 200;
        const gcTotalHeight = grandChildren.length * 60;
        const gcStartY = startY + idx * spacing - gcTotalHeight / 2 + 30;

        grandChildren.forEach((gc, gIdx) => {
          positioned.set(gc.id, {
            ...gc,
            x: gcStartX,
            y: gcStartY + gIdx * 60,
          });
        });
      });

      return allNodes.map((n) => positioned.get(n.id) || n);
    },
    [],
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setEditingId(null);
  }, []);

  const handleDoubleClick = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (node) {
        setEditingId(id);
        setEditText(node.text);
      }
    },
    [nodes],
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editingId || !editText.trim()) return;
    try {
      const updated = await updateNode(editingId, { text: editText.trim() });
      const newNodes = nodes.map((n) => (n.id === editingId ? { ...n, ...updated } : n));
      onNodesChange(newNodes);
      setEditingId(null);
    } catch {
      // ignore
    }
  }, [editingId, editText, nodes, onNodesChange]);

  const handleAddChild = useCallback(async () => {
    if (!selectedId) return;
    try {
      const parentNode = nodes.find((n) => n.id === selectedId);
      if (!parentNode) return;

      const siblings = nodes.filter((n) => n.parentId === selectedId);
      const newChild = await createNode({
        text: '新节点',
        x: parentNode.x + 220,
        y: parentNode.y + siblings.length * 80,
        mindMapId,
        parentId: selectedId,
        order: siblings.length,
      });

      const updated = layoutNodes([...nodes, newChild]);
      onNodesChange(updated);
    } catch {
      // ignore
    }
  }, [selectedId, nodes, mindMapId, onNodesChange, layoutNodes]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    try {
      await deleteNode(selectedId);
      const newNodes = nodes.filter((n) => n.id !== selectedId);
      onNodesChange(newNodes);
      setSelectedId(null);
    } catch {
      // ignore
    }
  }, [selectedId, nodes, onNodesChange]);

  const handleColorChange = useCallback(
    async (colorIndex: number) => {
      if (!selectedId) return;
      try {
        const updated = await updateNode(selectedId, { colorIndex });
        const newNodes = nodes.map((n) =>
          n.id === selectedId ? { ...n, ...updated } : n,
        );
        onNodesChange(newNodes);
      } catch {
        // ignore
      }
    },
    [selectedId, nodes, onNodesChange],
  );

  const handlePriorityChange = useCallback(
    async (priority: number) => {
      if (!selectedId) return;
      try {
        const updated = await updateNode(selectedId, { priority });
        const newNodes = nodes.map((n) =>
          n.id === selectedId ? { ...n, ...updated } : n,
        );
        onNodesChange(newNodes);
      } catch {
        // ignore
      }
    },
    [selectedId, nodes, onNodesChange],
  );

  // Pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === svgRef.current || (e.target as Element).tagName === 'rect' && (e.target as Element).getAttribute('fill') === 'white') {
        // Only pan if clicking on background
      }
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedId(null);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setViewBox((prev) => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy,
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    },
    [isPanning, panStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox((prev) => {
      const newW = prev.w * scaleFactor;
      const newH = prev.h * scaleFactor;
      const dx = (prev.w - newW) / 2;
      const dy = (prev.h - newH) / 2;
      return { x: prev.x + dx, y: prev.y + dy, w: newW, h: newH };
    });
  }, []);

  // Build connections (parent -> child)
  const connections: { parent: MindMapNodeData; child: MindMapNodeData }[] = [];
  nodes.forEach((node) => {
    if (node.parentId) {
      const parent = nodes.find((n) => n.id === node.parentId);
      if (parent) {
        connections.push({ parent, child: node });
      }
    }
  });

  const nodeHeight = selectedNode ? (selectedNode.isRoot ? 60 : 48) : 48;

  return (
    <div className="w-full h-full relative overflow-hidden bg-white">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Background */}
        <rect
          x={viewBox.x - 1000}
          y={viewBox.y - 1000}
          width={viewBox.w + 2000}
          height={viewBox.h + 2000}
          fill="white"
        />

        {/* Connection lines */}
        {connections.map((conn) => (
          <ConnectionLine
            key={`${conn.parent.id}-${conn.child.id}`}
            parent={conn.parent}
            child={conn.child}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <MindMapNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedId === node.id}
            onSelect={handleSelect}
            onDoubleClick={handleDoubleClick}
          />
        ))}

        {/* Edit input overlay */}
        {editingId && selectedNode && (
          <foreignObject
            x={selectedNode.x}
            y={selectedNode.y}
            width={selectedNode.isRoot ? 160 : 130}
            height={selectedNode.isRoot ? 60 : 48}
          >
            <input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setEditingId(null);
              }}
              style={{
                width: '100%',
                height: '100%',
                border: '2px solid #3B82F6',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: selectedNode.isRoot ? 18 : 14,
                fontWeight: selectedNode.isRoot ? 600 : 400,
                textAlign: 'center',
                outline: 'none',
                fontFamily: 'system-ui, sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </foreignObject>
        )}

        {/* Toolbar for selected node */}
        {selectedNode && !editingId && (
          <NodeToolbar
            nodeX={selectedNode.x}
            nodeY={selectedNode.y}
            nodeHeight={nodeHeight}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onColorChange={handleColorChange}
            onPriorityChange={handlePriorityChange}
            currentColorIndex={selectedNode.colorIndex}
            currentPriority={selectedNode.priority}
            isRoot={selectedNode.isRoot}
          />
        )}
      </svg>

      {/* Help text */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 select-none pointer-events-none">
        拖拽平移 · 滚轮缩放 · 单击选中 · 双击编辑
      </div>
    </div>
  );
}
