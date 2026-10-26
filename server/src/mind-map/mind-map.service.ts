import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MindMap } from './entities/mind-map.entity';
import { CreateMindMapDto, UpdateMindMapDto } from './dto/mind-map.dto';

@Injectable()
export class MindMapService {
  constructor(
    @InjectRepository(MindMap)
    private readonly mindMapRepository: Repository<MindMap>,
  ) {}

  async create(dto: CreateMindMapDto): Promise<MindMap> {
    const mindMap = this.mindMapRepository.create(dto);
    return this.mindMapRepository.save(mindMap);
  }

  async findAll(): Promise<MindMap[]> {
    return this.mindMapRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MindMap> {
    const mindMap = await this.mindMapRepository.findOne({
      where: { id },
      relations: ['nodes', 'nodes.parent', 'nodes.children'],
    });
    if (!mindMap) {
      throw new NotFoundException(`MindMap with id "${id}" not found`);
    }
    return mindMap;
  }

  async update(id: string, dto: UpdateMindMapDto): Promise<MindMap> {
    const mindMap = await this.findOne(id);
    Object.assign(mindMap, dto);
    return this.mindMapRepository.save(mindMap);
  }

  async remove(id: string): Promise<void> {
    const mindMap = await this.findOne(id);
    await this.mindMapRepository.remove(mindMap);
  }
}
