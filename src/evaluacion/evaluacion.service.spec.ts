import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EvaluacionEntity } from './evaluacion.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let evaluacionRepository: Repository<EvaluacionEntity>;
  let profesorRepository: Repository<ProfesorEntity>;
  let proyectoRepository: Repository<ProyectoEntity>;

  let profesoresList: ProfesorEntity[];
  let proyectosList: ProyectoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EvaluacionService],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    evaluacionRepository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
    profesorRepository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    proyectoRepository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await profesorRepository.clear();
    await proyectoRepository.clear();
    await evaluacionRepository.clear();

    profesoresList = [];
    for (let i = 0; i < 2; i++) {
      const profesor: ProfesorEntity = await profesorRepository.save({
        nombre: faker.person.fullName(),
        cedula: faker.number.int({ min: 1000000, max: 99999999 }),
        grupoInvestigacion: faker.lorem.word(),
        extension: faker.number.int({ min: 1000, max: 9999 }),
        departamento: faker.commerce.department(),
        esParEvaluador: faker.datatype.boolean(),
      });
      profesoresList.push(profesor);
    }

    proyectosList = [];
    const proyecto: ProyectoEntity = await proyectoRepository.save({
      titulo: faker.lorem.sentence(),
      area: faker.lorem.word(),
      presupuesto: faker.number.int({ min: 1000, max: 999999 }),
      notaFinal: faker.number.int({ min: 0, max: 5 }),
      estado: faker.number.int({ min: 0, max: 3 }),
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      url: faker.internet.url(),
      mentor: profesoresList[0],
    });
    proyectosList.push(proyecto);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearEvaluacion valida debe retornar evaluacion creada', async () => {
    const evaluacionData: Partial<EvaluacionEntity> = {
      proyecto: proyectosList[0],
      profesor: profesoresList[1],
    };

    const result: EvaluacionEntity = await service.crearEvaluacion(
      evaluacionData as EvaluacionEntity,
    );
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.proyecto?.id).toEqual(proyectosList[0].id);
    expect(result.profesor?.id).toEqual(profesoresList[1].id);
  });

  it('crearEvaluacion con mentor igual a profesor debe lanzar error', async () => {
    const evaluacionData: Partial<EvaluacionEntity> = {
      proyecto: proyectosList[0],
      profesor: profesoresList[0],
    };

    await expect(
      service.crearEvaluacion(evaluacionData as EvaluacionEntity),
    ).rejects.toThrowError('No se puede porque el mentor es profesor');
  });
});
