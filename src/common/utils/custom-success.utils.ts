export interface successResponse {
  status: number;
  message: string;
  data?: any;
}

export class CustomSuccess {
  static created(body?: any): successResponse {
    return {
      status: 201,
      message: 'Created',
      data: body,
    };
  }

  static success(body?: any): successResponse {
    return {
      status: 200,
      message: 'Success',
      data: body,
    };
  }

  static failed(body?: any): successResponse {
    return {
      status: 500,
      message: 'Failed',
      data: body,
    };
  }
}
