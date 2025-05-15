import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { EvaluacionService } from './evaluacion.service';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionEntity])],
  providers: [EvaluacionService],
})
export class EvaluacionModule {}
