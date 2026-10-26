import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MindMapNode } from './entities/node.entity';
import { NodeService } from './node.service';
import { NodeController } from './node.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MindMapNode])],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
