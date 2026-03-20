import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './erros/user-already-exists';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'teste@gmail.com';

    await sut.execute({
      name: 'teste',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.execute({
        email,
        name: 'teste-2',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
