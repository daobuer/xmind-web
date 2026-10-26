import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MindMap } from '../../mind-map/entities/mind-map.entity';

@Entity('mind_map_nodes')
export class MindMapNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  text: string;

  @Column({ type: 'float', default: 0 })
  x: number;

  @Column({ type: 'float', default: 0 })
  y: number;

  @Column({ type: 'int', default: 0 })
  colorIndex: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @Column({ type: 'uuid' })
  mindMapId: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false })
  isRoot: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MindMap, (mindMap) => mindMap.nodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mindMapId' })
  mindMap: MindMap;

  @ManyToOne(() => MindMapNode, (node) => node.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: MindMapNode;

  @OneToMany(() => MindMapNode, (node) => node.parent)
  children: MindMapNode[];
}
