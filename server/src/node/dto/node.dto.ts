import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength, Min, Max } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @MaxLength(500)
  text: string;

  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(6)
  colorIndex?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(3)
  priority?: number;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  mindMapId: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isRoot?: boolean;
}

export class UpdateNodeDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  text?: string;

  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(6)
  colorIndex?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(3)
  priority?: number;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
