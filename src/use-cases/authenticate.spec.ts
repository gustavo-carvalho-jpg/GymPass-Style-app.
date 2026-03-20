import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryRepository } from '@/repositories/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './erros/invalid-credentials-error';

let usersRepository: InMemoryRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'teste',
      email: 'teste@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'teste@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'teste@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'teste',
      email: 'teste@gmail.com',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      sut.execute({
        email: 'teste@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
