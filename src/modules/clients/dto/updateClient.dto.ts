import { IsString, IsEmail, IsOptional } from 'class-validator';
import { AtLeastOneField } from '../../../validators/at-least-one-field.validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @AtLeastOneField(['company_name', 'contact_email'], { message: 'At least one field (company_name or contact_email) must be provided.' })
  _atLeastOne?: any;
}