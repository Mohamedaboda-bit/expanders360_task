import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDocumentDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  projectId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;
}
