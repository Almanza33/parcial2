import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProyectoDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsNumber()
  presupuesto: number;

  @IsNotEmpty()
  @IsNumber()
  notaFinal: number;

  @IsNotEmpty()
  @IsNumber()
  estado: number;

  @IsNotEmpty()
  @IsString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsString()
  fechaFin: string;
}
