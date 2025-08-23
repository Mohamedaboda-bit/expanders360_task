import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNumber()
  @Min(0)
  response_sla_hours: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  service_ids: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  country_codes: string[];
}
