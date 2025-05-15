import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto <= 0) {
      throw new Error('No se puede por bajo presupuesto');
    }
    if (proyecto.titulo.length < 15) {
      throw new Error('El título debe tener al menos 15 cars');
    }
    return await this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
    });
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }
    if (proyecto.estado >= 4) {
      throw new Error('El proyecto no puede avanzar mas');
    }
    proyecto.estado++;
    await this.proyectoRepository.save(proyecto);

    return proyecto;
  }

  async findAllEstudiantes(id: number): Promise<EstudianteEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
    });
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }
    const estudiante = proyecto.lider;
    return estudiante;
  }
}
