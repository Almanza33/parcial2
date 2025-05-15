import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    if (estudiante.promedio <= 3.2) {
      throw new Error('El promedio no puede ser menor o igual a 3.2');
    }
    if (estudiante.semestre < 4) {
      throw new Error('El semestre no puede ser menor a 4');
    }
    return await this.estudianteRepository.save(estudiante);
  }

  async eliminarEstudiante(id: number): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });
    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }
    if (estudiante.proyectos.length > 0) {
      throw new Error(
        'No se puede eliminar el estudiante porque tiene proyectos activs',
      );
    }
    await this.estudianteRepository.delete(id);
  }
}
