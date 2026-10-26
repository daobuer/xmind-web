import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MindMapNode } from './entities/node.entity';
import { CreateNodeDto, UpdateNodeDto } from './dto/node.dto';

// 赤橙黄绿青蓝紫
export const NODE_COLORS = [
  '#EF4444', // 赤 red
  '#F97316', // 橙 orange
  '#EAB308', // 黄 yellow
  '#22C55E', // 绿 green
  '#06B6D4', // 青 cyan
  '#3B82F6', // 蓝 blue
  '#A855F7', // 紫 purple
];

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(MindMapNode)
    private readonly nodeRepository: Repository<MindMapNode>,
  ) {}

  async create(dto: CreateNodeDto): Promise<MindMapNode> {
    const node = this.nodeRepository.create(dto);

    // Auto-assign color based on siblings if not specified
    if (node.colorIndex === undefined || node.colorIndex === 0) {
      const siblings = await this.nodeRepository.find({
        where: { parentId: node.parentId || undefined, mindMapId: node.mindMapId },
      });
      node.colorIndex = siblings.length % NODE_COLORS.length;
    }

    return this.nodeRepository.save(node);
  }

  async findByMindMap(mindMapId: string): Promise<MindMapNode[]> {
    return this.nodeRepository.find({
      where: { mindMapId },
      relations: ['parent', 'children'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<MindMapNode> {
    const node = await this.nodeRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!node) {
      throw new NotFoundException(`Node with id "${id}" not found`);
    }
    return node;
  }

  async update(id: string, dto: UpdateNodeDto): Promise<MindMapNode> {
    const node = await this.findOne(id);
    Object.assign(node, dto);
    return this.nodeRepository.save(node);
  }

  async remove(id: string): Promise<void> {
    const node = await this.findOne(id);
    // Recursively remove children
    const children = await this.nodeRepository.find({ where: { parentId: id } });
    for (const child of children) {
      await this.remove(child.id);
    }
    await this.nodeRepository.remove(node);
  }

  async getNextColorIndex(parentId: string | null, mindMapId: string): Promise<number> {
    const siblings = await this.nodeRepository.find({
      where: { parentId: parentId || undefined, mindMapId },
    });
    return siblings.length % NODE_COLORS.length;
  }
}
