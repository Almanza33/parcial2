import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { ProfesorService } from './profesor.service';
import { ProfesorController } from './profesor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity])],
  providers: [ProfesorService],
  controllers: [ProfesorController],
})
export class ProfesorModule {}
