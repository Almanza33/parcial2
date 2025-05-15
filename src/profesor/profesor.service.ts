import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfesorEntity } from './profesor.entity';
import { EvaluacionEntity } from 'src/evaluacion/evaluacion.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,

    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    if (profesor.extension.toString.length !== 5) {
      throw new Error('La extensión debe tener 5 dis');
    }
    return await this.profesorRepository.save(profesor);
  }
  async asignarEvaluador(id: number, evaluacionID: number): Promise<void> {
    const profesor = await this.profesorRepository.findOne({
      where: { id },
      relations: ['evaluaciones'],
    });
    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id: evaluacionID },
      relations: ['profesor'],
    });
    if (!evaluacion) {
      throw new Error('Evaluación no encontrada');
    }

    if (profesor.evaluaciones.length >= 3) {
      throw new Error('El profe tiene muchas evals ya');
    }
    profesor.evaluaciones.push(evaluacion);
    await this.profesorRepository.save(profesor);
  }
}
