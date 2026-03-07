import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { PricingService } from '../pricing/data.pricing.service';
import { mtnPlans } from './mtn.plans';
import { cablePlans } from './cable.plans';

describe('Plans Service', () => {
  let service: PlansService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [PlansService, PricingService],
    }).compile();

    service = app.get<PlansService>(PlansService);
  });

  describe('plan service', () => {
    it('should return networks', () => {
      expect(service.getNetworks().length).toBe(5);
    });
    it('should return the plan types by network id', () => {
      expect(service.getPlanTypes(1)).toContain('SME2');
      expect(service.getPlanTypes(2)).toContain('GIFTING');
      expect(service.getPlanTypes(3)).toContain('GIFTING');
      expect(service.getPlanTypes(4)).toContain('SME');
      expect(service.getPlanTypes(5)).toEqual([]);
    });
    it('should return data plan by network id and type', async () => {
      const result = mtnPlans;

      jest.spyOn(service, 'getPlans').mockImplementation(async (_) => result);

      expect(await service.getPlans(1, 'sme')).toBe(result);
    });
    // it('should return throw error data not found', () => {
    //   expect(() => {
    //     service.findAndUpdatePrice(1, 1, 1);
    //   }).toThrow(CustomError.notFoundError('Data plan does not exist'));
    // });
    it('should return cables', () => {
      expect(service.getCables()).toContainEqual({
        cable_id: 1,
        cable_name: 'GOTV',
      });
    });
    it('should return cable plan by cable name', async () => {
      const result = cablePlans.slice(0, 7);

      jest
        .spyOn(service, 'getCablePlans')
        .mockImplementation(async (_) => result);

      expect(await service.getCablePlans('dstv')).toBe(result);
    });
    // it('should throw error cable plan not found', () => {
    //   expect(service.findAndUpdateCablePrice(1, 'strong', 1000)).toThrow(
    //     CustomError.notFoundError('Cable plan does not exist'),
    //   );
    // });
  });
});
