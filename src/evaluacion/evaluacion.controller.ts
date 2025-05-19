import { Controller, Post, Body } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionDto } from './evaluacion.dto';
import { EvaluacionEntity } from './evaluacion.entity';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  async crearEvaluacion(@Body() evaluacion: EvaluacionDto) {
    return await this.evaluacionService.crearEvaluacion(
      evaluacion as EvaluacionEntity,
    );
  }
}
