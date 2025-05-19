import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let proyectoRepository: Repository<ProyectoEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let profesorRepository: Repository<ProfesorEntity>;

  let proyectosList: ProyectoEntity[];
  let estudiantesList: EstudianteEntity[];
  let profesoresList: ProfesorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    proyectoRepository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    profesorRepository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await proyectoRepository.clear();
    await estudianteRepository.clear();
    await profesorRepository.clear();

    profesoresList = [];
    for (let i = 0; i < 2; i++) {
      const profesor = await profesorRepository.save({
        nombre: faker.person.fullName(),
        cedula: faker.number.int({ min: 1000000, max: 99999999 }),
        departamento: faker.commerce.department(),
        extension: faker.number.int({ min: 10000, max: 99999 }),
        esParEvaluador: faker.datatype.boolean(),
      });
      profesoresList.push(profesor);
    }

    estudiantesList = [];
    for (let i = 0; i < 2; i++) {
      const estudiante = await estudianteRepository.save({
        nombre: faker.person.fullName(),
        cedula: faker.number.int(),
        semestre: faker.number.int({ min: 4, max: 10 }),
        programa: faker.lorem.word(),
        promedio: faker.number.float({ min: 3.3, max: 5, fractionDigits: 1 }),
      });
      estudiantesList.push(estudiante);
    }

    proyectosList = [];
    for (let i = 0; i < 3; i++) {
      const proyecto = await proyectoRepository.save({
        titulo: faker.lorem.sentence(5),
        area: faker.lorem.word(),
        presupuesto: faker.number.int({ min: 1000, max: 100000 }),
        notaFinal: faker.number.int({ min: 0, max: 5 }),
        estado: faker.number.int({ min: 0, max: 3 }),
        fechaInicio: faker.date.past().toISOString(),
        fechaFin: faker.date.future().toISOString(),
        url: faker.internet.url(),
        lider: estudiantesList[i % estudiantesList.length],
        mentor: profesoresList[i % profesoresList.length],
      });
      proyectosList.push(proyecto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearProyecto valido debe retornar proyecto creado', async () => {
    const proyectoData: Partial<ProyectoEntity> = {
      titulo: 'Un titulo de proyecto suficientemente largo',
      area: faker.lorem.word(),
      presupuesto: 50000,
      notaFinal: 0,
      estado: 0,
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      lider: estudiantesList[0],
      mentor: profesoresList[0],
    };
    const result = await service.crearProyecto(proyectoData as ProyectoEntity);
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.titulo).toBe(proyectoData.titulo);
    expect(result.presupuesto).toBeGreaterThan(0);
  });

  it('crearProyecto con presupuesto invalido (<=0) debe lanzar error', async () => {
    const proyectoData: Partial<ProyectoEntity> = {
      titulo: 'Un titulo de proyecto suficientemente largo',
      presupuesto: 0,
      lider: estudiantesList[0],
      mentor: profesoresList[0],
    };
    await expect(
      service.crearProyecto(proyectoData as ProyectoEntity),
    ).rejects.toThrowError('No se puede por bajo presupuesto');
  });

  it('crearProyecto con titulo invalido (<15 chars) debe lanzar error', async () => {
    const proyectoData: Partial<ProyectoEntity> = {
      titulo: 'Corto',
      presupuesto: 50000,
      lider: estudiantesList[0],
      mentor: profesoresList[0],
    };
    await expect(
      service.crearProyecto(proyectoData as ProyectoEntity),
    ).rejects.toThrowError('El título debe tener al menos 15 cars');
  });

  it('avanzarProyecto valido debe incrementar el estado', async () => {
    const proyecto = proyectosList[0];
    const initialState = proyecto.estado;
    const result = await service.avanzarProyecto(proyecto.id as any);
    expect(result).toBeDefined();
    expect(result.estado).toBe(initialState + 1);
  });

  it('avanzarProyecto con id no existente debe lanzar error', async () => {
    const nonExistentId = 999999;
    await expect(service.avanzarProyecto(nonExistentId)).rejects.toThrowError(
      'Proyecto no encontrado',
    );
  });

  it('avanzarProyecto con estado >= 4 debe lanzar error', async () => {
    const proyectoEnEstadoMax = await proyectoRepository.save({
      titulo: 'Proyecto en estado maximo para test',
      area: faker.lorem.word(),
      presupuesto: 10000,
      notaFinal: 0,
      estado: 4,
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      url: faker.internet.url(),
      lider: estudiantesList[0],
      mentor: profesoresList[0],
    });
    await expect(
      service.avanzarProyecto(proyectoEnEstadoMax.id as any),
    ).rejects.toThrowError('El proyecto no puede avanzar mas');
  });

  it('findAllEstudiantes con proyecto valido y con lider debe retornar el estudiante', async () => {
    const proyectoConLider = proyectosList[0];
    expect(proyectoConLider.lider).toBeDefined();

    const result = await service.findAllEstudiantes(proyectoConLider.id as any);
    expect(result).toBeDefined();
    expect(result.id).toBe(proyectoConLider.lider?.id);
    expect(result.nombre).toBe(proyectoConLider.lider?.nombre);
  });

  it('findAllEstudiantes con id de proyecto no existente debe lanzar error', async () => {
    const nonExistentId = 999999;
    await expect(
      service.findAllEstudiantes(nonExistentId),
    ).rejects.toThrowError('Proyecto no encontrado');
  });

  it('findAllEstudiantes con proyecto sin lider debe lanzar error', async () => {
    const proyectoSinLider = await proyectoRepository.save({
      titulo: 'Proyecto sin lider para prueba de error',
      area: faker.lorem.word(),
      presupuesto: 10000,
      notaFinal: 0,
      estado: 1,
      fechaInicio: faker.date.past().toISOString(),
      fechaFin: faker.date.future().toISOString(),
      url: faker.internet.url(),
      lider: null,
      mentor: profesoresList[0],
    });
    await expect(
      service.findAllEstudiantes(proyectoSinLider.id as any),
    ).rejects.toThrowError('Estudiante no encontrado');
  });
});
