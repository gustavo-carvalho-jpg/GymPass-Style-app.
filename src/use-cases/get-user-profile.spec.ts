import { describe, it, expect, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './erros/resource-not-found-error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const { id } = await usersRepository.create({
      name: 'teste',
      email: 'teste@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({ userId: id });

    expect(user.name).toEqual('teste');
  });

  it('should be able to authenticate with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'none-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
