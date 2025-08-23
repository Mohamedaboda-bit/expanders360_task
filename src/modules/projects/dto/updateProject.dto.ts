import { IsString, IsOptional, IsArray, IsInt, IsNumber } from 'class-validator';
import { AtLeastOneField } from '../../../validators/at-least-one-field.validator';

export class UpdateProjectDto {

  @IsOptional()
  @IsString()
  country_code: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  service_ids: number[];

  @IsOptional()
  @IsNumber()
  budget: number;

  @AtLeastOneField([
    'country_code',
    'service_ids',
    'budget',
  ], { message: 'At least one field must be provided.' })
  _atLeastOne?: any;
}
