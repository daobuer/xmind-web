import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MindMap } from '../mind-map/entities/mind-map.entity';
import { MindMapNode } from '../node/entities/node.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH || '/tmp/mindmap.db',
      entities: [MindMap, MindMapNode],
      synchronize: true,
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
