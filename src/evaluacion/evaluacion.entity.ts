import { ProfesorEntity } from 'src/profesor/profesor.entity';
import { ProyectoEntity } from 'src/proyecto/proyecto.entity';
import { Entity, Long, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvaluacionEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.evaluaciones)
  proyecto: ProyectoEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.evaluaciones)
  profesor: ProfesorEntity;
}
