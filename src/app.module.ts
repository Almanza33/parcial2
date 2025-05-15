import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { EstudianteEntity } from './estudiante/estudiante.entity';
import { ProfesorEntity } from './profesor/profesor.entity';
import { ProyectoEntity } from './proyecto/proyecto.entity';
import { EvaluacionEntity } from './evaluacion/evaluacion.entity';

@Module({
  imports: [
    ProyectoModule,
    EstudianteModule,
    EvaluacionModule,
    ProfesorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [
        EstudianteEntity,
        ProfesorEntity,
        ProyectoEntity,
        EvaluacionEntity,
      ],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
