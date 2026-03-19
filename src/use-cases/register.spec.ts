import { describe, it, expect } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryRepository } from '@/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './erros/user-already-exists';

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.execute({
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
    const usersRepository = new InMemoryRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const email = 'teste@gmail.com';

    await registerUserCase.execute({
      name: 'teste',
      email,
      password: '123456',
    });

    await expect(() =>
      registerUserCase.execute({
        email,
        name: 'teste-2',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to register', async () => {
    const usersRepository = new InMemoryRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.execute({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
