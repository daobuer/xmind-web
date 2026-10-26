// 节点颜色：赤橙黄绿青蓝紫
export const NODE_COLORS = [
  '#EF4444', // 赤 red-500
  '#F97316', // 橙 orange-500
  '#EAB308', // 黄 yellow-500
  '#22C55E', // 绿 green-500
  '#06B6D4', // 青 cyan-500
  '#3B82F6', // 蓝 blue-500
  '#A855F7', // 紫 purple-500
] as const;

export const COLOR_NAMES = ['赤', '橙', '黄', '绿', '青', '蓝', '紫'] as const;

export const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: '无', color: '#9CA3AF' },
  1: { label: 'P1', color: '#EF4444' },
  2: { label: 'P2', color: '#F97316' },
  3: { label: 'P3', color: '#9CA3AF' },
};

export interface MindMapNodeData {
  id: string;
  text: string;
  x: number;
  y: number;
  colorIndex: number;
  priority: number;
  parentId: string | null;
  mindMapId: string;
  order: number;
  isRoot: boolean;
  children?: MindMapNodeData[];
}

export interface MindMapData {
  id: string;
  title: string;
  description: string | null;
  nodes: MindMapNodeData[];
}

// Use local API routes (proxied to NestJS backend)
const API_BASE = '/api';

export async function fetchMindMaps(): Promise<MindMapData[]> {
  const res = await fetch(`${API_BASE}/mind-maps`);
  if (!res.ok) throw new Error('Failed to fetch mind maps');
  return res.json();
}

export async function createMindMap(title: string, description?: string): Promise<MindMapData> {
  const res = await fetch(`${API_BASE}/mind-maps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Failed to create mind map');
  return res.json();
}

export async function fetchMindMap(id: string): Promise<MindMapData> {
  const res = await fetch(`${API_BASE}/mind-maps/${id}`);
  if (!res.ok) throw new Error('Failed to fetch mind map');
  return res.json();
}

export async function deleteMindMap(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/mind-maps/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete mind map');
}

export async function createNode(data: {
  text: string;
  x?: number;
  y?: number;
  colorIndex?: number;
  priority?: number;
  parentId?: string;
  mindMapId: string;
  order?: number;
  isRoot?: boolean;
}): Promise<MindMapNodeData> {
  const res = await fetch(`${API_BASE}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create node');
  return res.json();
}

export async function updateNode(
  id: string,
  data: {
    text?: string;
    x?: number;
    y?: number;
    colorIndex?: number;
    priority?: number;
    parentId?: string;
    order?: number;
  },
): Promise<MindMapNodeData> {
  const res = await fetch(`${API_BASE}/nodes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update node');
  return res.json();
}

export async function deleteNode(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/nodes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete node');
}

export async function fetchNodes(mindMapId: string): Promise<MindMapNodeData[]> {
  const res = await fetch(`${API_BASE}/nodes?mindMapId=${mindMapId}`);
  if (!res.ok) throw new Error('Failed to fetch nodes');
  return res.json();
}
