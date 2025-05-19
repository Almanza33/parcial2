import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteEntity } from './estudiante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;
  let estudianteList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    estudianteList = [];
    for (let i = 0; i < 5; i++) {
      const estudiante: EstudianteEntity = await repository.save({
        nombre: faker.person.fullName(),
        cedula: faker.number.int(),
        semestre: faker.number.int(),
        programa: faker.lorem.word(),
        promedio: faker.number.int(),
      });
      estudianteList.push(estudiante);
    }
  };

  it('crearEstudiante valido debe retornar estudiante creado', async () => {
    const estudianteData: Partial<EstudianteEntity> = {
      nombre: faker.person.fullName(),
      cedula: faker.number.int(),
      semestre: 5,
      programa: faker.lorem.word(),
      promedio: 4,
      proyectos: [],
    };
    const result: EstudianteEntity = await service.crearEstudiante(
      estudianteData as EstudianteEntity,
    );
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.nombre).toBe(estudianteData.nombre);
  });

  it('crearEstudiante con promedio menor o igual a 3.2 debe lanzar error', async () => {
    const estudianteData: Partial<EstudianteEntity> = {
      nombre: faker.person.fullName(),
      cedula: faker.number.int(),
      semestre: 5,
      programa: faker.lorem.word(),
      promedio: 3.1,
      proyectos: [],
    };
    await expect(
      service.crearEstudiante(estudianteData as EstudianteEntity),
    ).rejects.toThrowError('El promedio no puede ser menor o igual a 3.2');
  });

  it('crearEstudiante con semestre menor a 4 debe lanzar error', async () => {
    const estudianteData: Partial<EstudianteEntity> = {
      nombre: faker.person.fullName(),
      cedula: faker.number.int(),
      semestre: 3,
      programa: faker.lorem.word(),
      promedio: 3.5,
      proyectos: [],
    };
    await expect(
      service.crearEstudiante(estudianteData as EstudianteEntity),
    ).rejects.toThrowError('El semestre no puede ser menor a 4');
  });

  it('eliminarEstudiante valido debe eliminar el estudiante', async () => {
    const estudiante = estudianteList[0];
    estudiante.proyectos = [];
    await repository.save(estudiante);

    await service.eliminarEstudiante(estudiante.id as any);
    const deletedEstudiante = await repository.findOne({
      where: { id: estudiante.id },
    });
    expect(deletedEstudiante).toBeNull();
  });

  it('eliminarEstudiante con id no existente debe lanzar error', async () => {
    const nonExistentId = 999999;
    await expect(
      service.eliminarEstudiante(nonExistentId),
    ).rejects.toThrowError('Estudiante no encontrado');
  });
});
