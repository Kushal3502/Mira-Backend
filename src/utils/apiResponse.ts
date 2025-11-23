export class ApiResponse<T> {
  data: T | null;
  message: string;
  success: boolean;

  constructor(statusCode: number, message = "Success", data: T | null = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
