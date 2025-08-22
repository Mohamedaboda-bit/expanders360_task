import { ValidationOptions } from 'class-validator';
export declare function AtLeastOneField(propertyNames: string[], validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
