import {
  Entity,
  Long,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  semestre: number;

  @Column()
  programa: string;

  @Column()
  promedio: number;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.lider)
  proyectos: ProyectoEntity[];
}
