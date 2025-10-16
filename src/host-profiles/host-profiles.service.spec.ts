import { Test, TestingModule } from '@nestjs/testing';
import { HostProfilesService } from './host-profiles.service';

describe('HostProfilesService', () => {
  let service: HostProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HostProfilesService],
    }).compile();

    service = module.get<HostProfilesService>(HostProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
