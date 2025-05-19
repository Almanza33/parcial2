import { ProfesorEntity } from '../profesor/profesor.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { Entity, Long, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvaluacionEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.evaluaciones)
  proyecto: ProyectoEntity | null;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.evaluaciones)
  profesor: ProfesorEntity | null;
}
