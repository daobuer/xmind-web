import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MindMap } from './entities/mind-map.entity';
import { MindMapService } from './mind-map.service';
import { MindMapController } from './mind-map.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MindMap])],
  controllers: [MindMapController],
  providers: [MindMapService],
  exports: [MindMapService],
})
export class MindMapModule {}
