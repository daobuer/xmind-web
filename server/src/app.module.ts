import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MindMapModule } from './mind-map/mind-map.module';
import { NodeModule } from './node/node.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MindMapModule,
    NodeModule,
  ],
})
export class AppModule {}
