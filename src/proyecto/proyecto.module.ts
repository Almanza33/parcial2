import { Module } from '@nestjs/common';
import { ProyectoEntity } from './proyecto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProyectoEntity])],
  providers: [ProyectoService],
  controllers: [ProyectoController],
})
export class ProyectoModule {}
