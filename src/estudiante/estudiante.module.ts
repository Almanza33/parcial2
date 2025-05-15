import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteEntity])],
  providers: [EstudianteService],
})
export class EstudianteModule {}
