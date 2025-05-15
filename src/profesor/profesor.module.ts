import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { ProfesorService } from './profesor.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity])],
  providers: [ProfesorService],
})
export class ProfesorModule {}
