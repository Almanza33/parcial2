import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(@Body() estudiante: EstudianteDto) {
    return await this.estudianteService.crearEstudiante(
      estudiante as EstudianteEntity,
    );
  }

  @Delete(':id')
  async eliminarEstudiante(@Param('id', ParseIntPipe) id: number) {
    return await this.estudianteService.eliminarEstudiante(id);
  }
}
