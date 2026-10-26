'use client';

import { NODE_COLORS, PRIORITY_LABELS, type MindMapNodeData } from '@/lib/api';

interface MindMapNodeProps {
  node: MindMapNodeData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

export function MindMapNodeComponent({
  node,
  isSelected,
  onSelect,
  onDoubleClick,
}: MindMapNodeProps) {
  const borderColor = node.isRoot ? '#1a1a1a' : NODE_COLORS[node.colorIndex % NODE_COLORS.length];
  const borderWidth = node.isRoot ? 2.5 : 2;
  const width = node.isRoot ? 160 : 130;
  const height = node.isRoot ? 60 : 48;
  const fontSize = node.isRoot ? 18 : 14;
  const fontWeight = node.isRoot ? 600 : 400;

  const priorityInfo = PRIORITY_LABELS[node.priority] || PRIORITY_LABELS[0];

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(node.id);
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Selection highlight */}
      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={14}
          ry={14}
          fill="none"
          stroke={borderColor}
          strokeWidth={1.5}
          strokeDasharray="4 2"
          opacity={0.5}
        />
      )}

      {/* Node background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={10}
        ry={10}
        fill="white"
        stroke={borderColor}
        strokeWidth={borderWidth}
      />

      {/* Priority badge */}
      {node.priority > 0 && (
        <g transform={`translate(${width - 32}, -8)`}>
          <rect
            x={0}
            y={0}
            width={28}
            height={18}
            rx={9}
            ry={9}
            fill={priorityInfo.color}
          />
          <text
            x={14}
            y={13}
            textAnchor="middle"
            fill="white"
            fontSize={10}
            fontWeight={600}
            fontFamily="system-ui, sans-serif"
          >
            {priorityInfo.label}
          </text>
        </g>
      )}

      {/* Node text */}
      <text
        x={width / 2}
        y={height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1a1a1a"
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {node.text}
      </text>
    </g>
  );
}
