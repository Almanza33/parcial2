import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoDto } from './proyecto.dto';
import { ProyectoEntity } from './proyecto.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async crearProyecto(@Body() proyecto: ProyectoDto) {
    return await this.proyectoService.crearProyecto(proyecto as ProyectoEntity);
  }

  @Put('/avanzar/:id')
  async avanzarProyecto(@Param('id', ParseIntPipe) id: number) {
    return await this.proyectoService.avanzarProyecto(id);
  }

  @Get('/estudiantes/:id')
  async obtenerEstudiantes(@Param('id', ParseIntPipe) id: number) {
    return await this.proyectoService.findAllEstudiantes(id);
  }
}
