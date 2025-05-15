import { EvaluacionEntity } from 'src/evaluacion/evaluacion.entity';
import { ProyectoEntity } from 'src/proyecto/proyecto.entity';
import {
  Entity,
  Long,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class ProfesorEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.mentor)
  mentorias: ProyectoEntity[];

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[];
}
