// import { Test, TestingModule } from '@nestjs/testing';
// import { WebhookService } from './webhook.service';
// import { UsersService } from '../users/users.service';
// import { WalletService } from '../wallet/wallet.service';
// import { TransactionService } from '../transactions/transaction.service';
// import { WebhookController } from './webhook.controller';
// import { HttpService } from '@nestjs/axios';
// import { of } from 'rxjs';
// import { AxiosResponse } from 'axios';
// import { HttpModule } from '@nestjs/axios';

// describe('WebhookService', () => {
//   let service: WebhookService;
//   let httpService: HttpService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [HttpModule],
//       controllers: [WebhookController],
//       providers: [
//         WebhookService,
//         UsersService,
//         WalletService,
//         TransactionService,
//       ],
//     }).compile();

//     service = module.get<WebhookService>(WebhookService);
//     httpService = module.get<HttpService>(HttpService);
//   });

//   describe('getToken', () => {
//     it('should return a token string', async () => {
//       // ✅ Define the mock response properly
//       const mockResponse: AxiosResponse = {
//         data: {
//           responseBody: {
//             accessToken: 'mocked_token', // this is what getToken() expects
//           },
//         },
//         status: 200,
//         statusText: 'OK',
//         headers: {},
//         config: {} as any,
//       };

//       // ✅ Spy on httpService.post (not get)
//       jest.spyOn(httpService, 'post').mockReturnValueOnce(of(mockResponse));

//       const token = await service.getToken();

//       expect(token).toBe('mocked_token');
//       expect(typeof token).toBe('string');
//     });
//   });

//   describe('fundAccount', () => {
//     it('should process a successful webhook', async () => {
//       const rawBody = JSON.stringify({
//         transactionReference: 'txn_123',
//         customer: { email: 'test@example.com' },
//         amountPaid: 1000,
//         currency: 'NGN',
//         paymentMethod: 'CARD',
//         paidOn: new Date().toISOString(),
//         paymentStatus: 'PAID',
//       });

//       const signature = 'valid_signature';

//       // Mock verifyWebhook to always return true
//       jest.spyOn(service, 'verifyWebhook').mockReturnValue(true);

//       // Mock UsersService
//       const mockUser = { id: 'user_1', email: 'test@example.com' };
//       jest
//         .spyOn(service['usersService'], 'findUserByEmail')
//         .mockResolvedValue(mockUser);

//       // Mock WalletService.credit
//       jest
//         .spyOn(service['walletService'], 'credit')
//         .mockResolvedValue({ oldBalance: 0, newBalance: 1000 });

//       // Mock TransactionService
//       jest
//         .spyOn(service['transactionService'], 'findTransactionByReference')
//         .mockResolvedValue(null); // simulate no existing transaction
//       jest
//         .spyOn(service['transactionService'], 'createReference')
//         .mockResolvedValue(undefined);
//       jest
//         .spyOn(service['transactionService'], 'updateReferenceStatus')
//         .mockResolvedValue(undefined);
//       jest
//         .spyOn(service['transactionService'], 'createTransaction')
//         .mockResolvedValue({
//           amount: 1000,
//           newBalance: 1000,
//           oldBalance: 0,
//           reference: 'txn_123',
//           paymentMethod: 'CARD',
//           date: new Date().toISOString(),
//           type: 'deposit',
//           status: 'success',
//         });

//       const result = await service.fundAccount(rawBody, signature);

//       expect(result).toHaveProperty('status', 200);
//       expect(service.verifyWebhook).toHaveBeenCalledWith(rawBody, signature);
//     });
//   });
// });
