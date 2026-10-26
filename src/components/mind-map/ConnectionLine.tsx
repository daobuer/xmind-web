'use client';

import { NODE_COLORS, type MindMapNodeData } from '@/lib/api';

interface ConnectionLineProps {
  parent: MindMapNodeData;
  child: MindMapNodeData;
}

export function ConnectionLine({ parent, child }: ConnectionLineProps) {
  const parentWidth = parent.isRoot ? 160 : 130;
  const parentHeight = parent.isRoot ? 60 : 48;
  const childWidth = child.isRoot ? 160 : 130;
  const childHeight = child.isRoot ? 60 : 48;

  // Parent right-center to child left-center
  const x1 = parent.x + parentWidth;
  const y1 = parent.y + parentHeight / 2;
  const x2 = child.x;
  const y2 = child.y + childHeight / 2;

  // Bezier curve control points
  const midX = (x1 + x2) / 2;
  const cp1x = midX;
  const cp1y = y1;
  const cp2x = midX;
  const cp2y = y2;

  const color = NODE_COLORS[child.colorIndex % NODE_COLORS.length];

  const path = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}
