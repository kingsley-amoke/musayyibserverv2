import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorConfig {
  apiKey = process.env.VENDOR_API_KEY;
  baseUrl = process.env.VENDOR_BASE_URL;
}
