import { Controller, Post, Body } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorDto } from './profesor.dto';
import { ProfesorEntity } from './profesor.entity';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async crearProfesor(@Body() profesor: ProfesorDto) {
    return await this.profesorService.crearProfesor(profesor as ProfesorEntity);
  }
}
