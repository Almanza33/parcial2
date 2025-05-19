import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
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
  mentorias: ProyectoEntity[] | null;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[] | null;
}
