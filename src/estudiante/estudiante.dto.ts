import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EstudianteDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  cedula: number;

  @IsNotEmpty()
  @IsNumber()
  semestre: number;

  @IsNotEmpty()
  @IsString()
  programa: string;

  @IsNotEmpty()
  @IsNumber()
  promedio: number;
}
