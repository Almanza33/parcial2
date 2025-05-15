import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfesorEntity } from './profesor.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    if (profesor.extension.toString.length !== 5) {
      throw new Error('La extensión debe tener 5 dis');
    }
    return await this.profesorRepository.save(profesor);
  }
}
