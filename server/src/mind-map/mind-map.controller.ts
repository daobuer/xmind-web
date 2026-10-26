import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MindMapService } from './mind-map.service';
import { CreateMindMapDto, UpdateMindMapDto } from './dto/mind-map.dto';

@Controller('api/mind-maps')
export class MindMapController {
  constructor(private readonly mindMapService: MindMapService) {}

  @Post()
  create(@Body() dto: CreateMindMapDto) {
    return this.mindMapService.create(dto);
  }

  @Get()
  findAll() {
    return this.mindMapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mindMapService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMindMapDto,
  ) {
    return this.mindMapService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mindMapService.remove(id);
  }
}
