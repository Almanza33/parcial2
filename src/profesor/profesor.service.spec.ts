import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProfesorEntity } from './profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let profesorRepository: Repository<ProfesorEntity>;
  let evaluacionRepository: Repository<EvaluacionEntity>;

  let profesoresList: ProfesorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    profesorRepository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    evaluacionRepository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await profesorRepository.clear();
    await evaluacionRepository.clear();

    profesoresList = [];
    for (let i = 0; i < 3; i++) {
      const profesor: ProfesorEntity = await profesorRepository.save({
        nombre: faker.person.fullName(),
        cedula: faker.number.int({ min: 1000000, max: 99999999 }),
        departamento: faker.commerce.department(),
        extension: faker.number.int({ min: 10000, max: 99999 }),
        esParEvaluador: faker.datatype.boolean(),
        evaluaciones: [],
      });
      profesoresList.push(profesor);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearProfesor valido debe retornar profesor creado', async () => {
    const profesorData: Partial<ProfesorEntity> = {
      nombre: faker.person.fullName(),
      cedula: faker.number.int({ min: 1000000, max: 99999999 }),
      departamento: faker.commerce.department(),
      extension: 12345,
      esParEvaluador: faker.datatype.boolean(),
    };
    const result: ProfesorEntity = await service.crearProfesor(
      profesorData as ProfesorEntity,
    );
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.nombre).toBe(profesorData.nombre);
    expect(result.extension.toString().length).toBe(5);
  });

  it('crearProfesor con extension no valida debe lanzar error', async () => {
    const profesorData: Partial<ProfesorEntity> = {
      nombre: faker.person.fullName(),
      cedula: faker.number.int({ min: 1000000, max: 99999999 }),
      departamento: faker.commerce.department(),
      extension: faker.number.int({ min: 100, max: 9999 }),
      esParEvaluador: faker.datatype.boolean(),
    };
    await expect(
      service.crearProfesor(profesorData as ProfesorEntity),
    ).rejects.toThrowError('La extensión debe tener 5 dis');
  });

  it('asignarEvaluador con profesor valido y < 3 evaluaciones debe completar', async () => {
    const profesor = profesoresList[0];
    const mockEvaluacionId = 123;

    profesor.evaluaciones = [];
    await profesorRepository.save(profesor);

    await expect(
      service.asignarEvaluador(profesor.id as any, mockEvaluacionId),
    ).resolves.not.toThrow();
    const updatedProfesor = await profesorRepository.findOne({
      where: { id: profesor.id },
      relations: ['evaluaciones'],
    });
    expect(updatedProfesor?.evaluaciones?.length).toBe(0);
  });

  it('asignarEvaluador con profesor no existente debe lanzar error', async () => {
    const nonExistentProfesorId = 99999;
    const mockEvaluacionId = 456;
    await expect(
      service.asignarEvaluador(nonExistentProfesorId, mockEvaluacionId),
    ).rejects.toThrowError('Profesor no encontrado');
  });

  /*   it('asignarEvaluador con profesor con >= 3 evaluaciones debe lanzar error', async () => {
    const profesorConMuchasEvaluaciones = profesoresList[1];

    const dummyProyecto = await profesorRepository.manager
      .getRepository(ProyectoEntity)
      .save({
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

    const mockEvaluaciones: EvaluacionEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const evalMock = await evaluacionRepository.save({
        proyecto: dummyProyecto,
        profesor: profesorConMuchasEvaluaciones,
      });
      mockEvaluaciones.push(evalMock);
    }
    profesorConMuchasEvaluaciones.evaluaciones = mockEvaluaciones;
    await profesorRepository.save(profesorConMuchasEvaluaciones);

    const mockEvaluacionId = 789;

    await expect(
      service.asignarEvaluador(
        profesorConMuchasEvaluaciones.id as any,
        mockEvaluacionId,
      ),
    ).rejects.toThrowError('El profe tiene muchas evals ya');
  }); */
});
