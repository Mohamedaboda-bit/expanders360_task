import { IsString, IsOptional, IsArray, IsInt, IsNumber, Min, Max } from 'class-validator';
import { AtLeastOneField } from '../../../validators/at-least-one-field.validator';

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  response_sla_hours: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  service_ids: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  country_codes: string[];

  @AtLeastOneField([
    'name',
    'rating',
    'response_sla_hours',
    'service_ids',
    'country_codes',
  ], { message: 'At least one field must be provided.' })
  _atLeastOne?: any;
}
