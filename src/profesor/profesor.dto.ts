import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProfesorDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  cedula: number;

  @IsNotEmpty()
  @IsString()
  departamento: string;

  @IsNotEmpty()
  @IsNumber()
  extension: number;

  @IsNotEmpty()
  @IsBoolean()
  esParEvaluador: boolean;
}
