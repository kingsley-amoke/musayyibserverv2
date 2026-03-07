// config/app.config.ts
export default () => ({
  port: process.env.PORT,
  monnify: {
    apiKey: process.env.MONNIFY_API_KEY,
    secret: process.env.MONNIFY_SECRET_KEY,
    contractCode: process.env.MONNIFY_CONTRACT_CODE,
  },
  vendor: {
    baseUrl: process.env.VENDOR_BASE_URL,
    apiKey: process.env.VENDOR_API_KEY,
  },
});
