import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '思维导图 - Mind Map Tool',
    template: '%s | 思维导图',
  },
  description: '网页版思维导图工具，支持节点管理、颜色轮换和优先级设置',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
