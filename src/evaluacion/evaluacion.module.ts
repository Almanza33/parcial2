import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluacionEntity])],
  providers: [EvaluacionService],
  controllers: [EvaluacionController],
})
export class EvaluacionModule {}
