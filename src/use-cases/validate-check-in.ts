import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFoundError } from './erros/resource-not-found-error';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './erros/late-check-in-validation-error';

interface ValidaCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidaCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidaCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidaCheckInUseCaseRequest): Promise<ValidaCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
