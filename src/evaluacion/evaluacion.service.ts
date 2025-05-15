import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EvaluacionEntity } from './evaluacion.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async crearEvaluacion(
    evaluacion: EvaluacionEntity,
  ): Promise<EvaluacionEntity> {
    if (evaluacion.proyecto.mentor === evaluacion.profesor) {
      throw new Error('No se puede porque el mentor es profesor');
    }
    return await this.evaluacionRepository.save(evaluacion);
  }
}
