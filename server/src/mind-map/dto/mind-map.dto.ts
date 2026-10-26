import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateMindMapDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateMindMapDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
