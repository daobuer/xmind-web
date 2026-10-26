'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  type MindMapData,
  type MindMapNodeData,
  fetchMindMaps,
  createMindMap,
  fetchMindMap,
  deleteMindMap,
  createNode,
} from '@/lib/api';
import { MindMapCanvas } from '@/components/mind-map/MindMapCanvas';

export default function MindMapPage() {
  const [mindMaps, setMindMaps] = useState<MindMapData[]>([]);
  const [currentMap, setCurrentMap] = useState<MindMapData | null>(null);
  const [nodes, setNodes] = useState<MindMapNodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMapDialog, setShowNewMapDialog] = useState(false);
  const [newMapTitle, setNewMapTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadMindMaps = useCallback(async () => {
    try {
      const maps = await fetchMindMaps();
      setMindMaps(maps);
      if (maps.length > 0 && !currentMap) {
        await selectMap(maps[0].id);
      }
    } catch {
      setError('无法连接后端服务，请确保 NestJS 服务已启动');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectMap = useCallback(async (id: string) => {
    try {
      const map = await fetchMindMap(id);
      setCurrentMap(map);
      setNodes(map.nodes || []);
    } catch {
      setError('加载思维导图失败');
    }
  }, []);

  useEffect(() => {
    loadMindMaps();
  }, [loadMindMaps]);

  const handleCreateMap = async () => {
    if (!newMapTitle.trim()) return;
    try {
      const map = await createMindMap(newMapTitle.trim());
      // Create root node
      const rootNode = await createNode({
        text: '中心主题',
        x: 100,
        y: 300,
        mindMapId: map.id,
        isRoot: true,
        order: 0,
      });
      const updatedMap = { ...map, nodes: [rootNode] };
      setMindMaps([updatedMap, ...mindMaps]);
      setCurrentMap(updatedMap);
      setNodes([rootNode]);
      setShowNewMapDialog(false);
      setNewMapTitle('');
    } catch {
      setError('创建思维导图失败');
    }
  };

  const handleDeleteMap = async (id: string) => {
    try {
      await deleteMindMap(id);
      const newMaps = mindMaps.filter((m) => m.id !== id);
      setMindMaps(newMaps);
      if (currentMap?.id === id) {
        if (newMaps.length > 0) {
          await selectMap(newMaps[0].id);
        } else {
          setCurrentMap(null);
          setNodes([]);
        }
      }
    } catch {
      setError('删除思维导图失败');
    }
  };

  const handleNodesChange = (newNodes: MindMapNodeData[]) => {
    setNodes(newNodes);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-500 text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800">思维导图</h1>
          <p className="text-xs text-gray-500 mt-1">Mind Map Tool</p>
        </div>

        <div className="p-3">
          <button
            onClick={() => setShowNewMapDialog(true)}
            className="w-full py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            + 新建导图
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-1">
            我的导图
          </div>
          {mindMaps.length === 0 ? (
            <div className="text-sm text-gray-400 px-1">暂无导图</div>
          ) : (
            <div className="space-y-1">
              {mindMaps.map((map) => (
                <div
                  key={map.id}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    currentMap?.id === map.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => selectMap(map.id)}
                >
                  <span className="text-sm truncate">{map.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMap(map.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    title="删除"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mx-3 mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            {error}
          </div>
        )}
      </aside>

      {/* Main canvas area */}
      <main className="flex-1 relative">
        {currentMap ? (
          <>
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-800">{currentMap.title}</h2>
                {currentMap.description && (
                  <p className="text-xs text-gray-500">{currentMap.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>节点数: {nodes.length}</span>
              </div>
            </div>

            <MindMapCanvas
              nodes={nodes}
              mindMapId={currentMap.id}
              onNodesChange={handleNodesChange}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">欢迎使用思维导图</h2>
              <p className="text-gray-500 mb-6">点击左侧「新建导图」开始创建</p>
              <button
                onClick={() => setShowNewMapDialog(true)}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                创建第一个导图
              </button>
            </div>
          </div>
        )}
      </main>

      {/* New map dialog */}
      {showNewMapDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新建思维导图</h3>
            <input
              autoFocus
              value={newMapTitle}
              onChange={(e) => setNewMapTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateMap();
                if (e.key === 'Escape') setShowNewMapDialog(false);
              }}
              placeholder="输入导图标题..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowNewMapDialog(false);
                  setNewMapTitle('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateMap}
                disabled={!newMapTitle.trim()}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
