import { Module } from '@nestjs/common';
import { ProyectoEntity } from './proyecto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoEntity])],
  providers: [ProyectoService],
})
export class ProyectoModule {}
