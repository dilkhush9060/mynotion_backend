export interface IAuthResponse {
  statusCode: number;
  message?: string;
  data?: object;
  error?: any;
}

export interface IAuthService {
  signUp(
    name: string,
    email: string,
    phone?: string,
    password?: string
  ): Promise<IAuthResponse>;
  signIn(email: string, password: string): Promise<IAuthResponse>;
}
