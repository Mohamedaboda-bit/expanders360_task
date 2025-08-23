import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsObject } from 'class-validator';
import { AtLeastOneField } from '../../../validators/at-least-one-field.validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @AtLeastOneField([
    'title',
    'content',
    'projectId',
  ], { message: 'At least title, content, and projectId must be provided.' })
  _atLeastOne?: any;
}
