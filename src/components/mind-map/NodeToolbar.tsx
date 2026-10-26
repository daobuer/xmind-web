'use client';

import { NODE_COLORS, COLOR_NAMES, PRIORITY_LABELS } from '@/lib/api';

interface NodeToolbarProps {
  nodeX: number;
  nodeY: number;
  nodeHeight: number;
  onAddChild: () => void;
  onDelete: () => void;
  onColorChange: (colorIndex: number) => void;
  onPriorityChange: (priority: number) => void;
  currentColorIndex: number;
  currentPriority: number;
  isRoot: boolean;
}

export function NodeToolbar({
  nodeX,
  nodeY,
  nodeHeight,
  onAddChild,
  onDelete,
  onColorChange,
  onPriorityChange,
  currentColorIndex,
  currentPriority,
  isRoot,
}: NodeToolbarProps) {
  const toolbarX = nodeX;
  const toolbarY = nodeY + nodeHeight + 12;

  return (
    <foreignObject x={toolbarX - 20} y={toolbarY} width={320} height={120}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: 8,
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onAddChild}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#f9fafb',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            + 子节点
          </button>
          {!isRoot && (
            <button
              onClick={onDelete}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              删除
            </button>
          )}
        </div>

        {/* Color selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#6b7280', minWidth: 36 }}>边框色:</span>
          {NODE_COLORS.map((color, idx) => (
            <button
              key={idx}
              onClick={() => onColorChange(idx)}
              title={COLOR_NAMES[idx]}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: idx === currentColorIndex ? '2px solid #1a1a1a' : '2px solid transparent',
                background: color,
                cursor: 'pointer',
                outline: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Priority selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#6b7280', minWidth: 36 }}>优先级:</span>
          {[0, 1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => onPriorityChange(p)}
              style={{
                padding: '2px 8px',
                borderRadius: 10,
                border: p === currentPriority ? '2px solid #1a1a1a' : '1px solid #d1d5db',
                background: p === 0 ? '#f3f4f6' : PRIORITY_LABELS[p].color,
                color: p === 0 ? '#6b7280' : 'white',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: p === currentPriority ? 700 : 400,
              }}
            >
              {PRIORITY_LABELS[p].label}
            </button>
          ))}
        </div>
      </div>
    </foreignObject>
  );
}
