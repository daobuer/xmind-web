import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto, UpdateNodeDto } from './dto/node.dto';

@Controller('api/nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  create(@Body() dto: CreateNodeDto) {
    return this.nodeService.create(dto);
  }

  @Get()
  findByMindMap(@Query('mindMapId') mindMapId: string) {
    return this.nodeService.findByMindMap(mindMapId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.nodeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNodeDto,
  ) {
    return this.nodeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.nodeService.remove(id);
  }

  @Get('color/next')
  getNextColor(
    @Query('parentId') parentId: string,
    @Query('mindMapId') mindMapId: string,
  ) {
    return this.nodeService.getNextColorIndex(
      parentId || null,
      mindMapId,
    );
  }
}
