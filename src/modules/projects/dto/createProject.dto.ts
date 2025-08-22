import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateProjectDto {

  @IsString()
  @IsNotEmpty()
  country_code: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  service_ids: number[];

  @IsNumber()
  budget: number;
}
