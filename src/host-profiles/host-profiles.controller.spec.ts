import { Test, TestingModule } from '@nestjs/testing';
import { HostProfilesController } from './host-profiles.controller';

describe('HostProfilesController', () => {
  let controller: HostProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostProfilesController],
    }).compile();

    controller = module.get<HostProfilesController>(HostProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
