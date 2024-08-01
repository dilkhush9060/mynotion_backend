import { User } from "@prisma/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;

  role: string;

  avatar?: string;
  about?: string;

  password?: string;

  isVerified: boolean;
  isApproved: boolean;

  token?: string;
  otp?: string;

  createdAt: Date;
  updatedAt: Date;
}
export interface ICreateUser {
  name: string;
  email: string;
  phone?: string;

  password?: string;
  role?: string;

  avatar?: string;

  token: string;
  otp: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;

  about?: string;
  avatar?: string;

  role?: string;

  token?: string | null;
  otp?: string | null;
}

export interface IUserResponse {
  user: IUser | null;
}

export interface IUsersResponse {
  users: Array<IUser> | [];
  usersCount: number;
}

export interface IUserRepositories {
  createUser(data: ICreateUser): Promise<unknown | IUserResponse>;
  updateUserById(
    id: string,
    data: IUpdateUser
  ): Promise<unknown | IUserResponse>;
  updateUserByEmail(
    email: string,
    data: IUpdateUser
  ): Promise<unknown | IUserResponse>;
  deleteUserById(
    id: string,
    data: IUpdateUser
  ): Promise<unknown | IUserResponse>;
  deleteUserByEmail(
    email: string,
    data: IUpdateUser
  ): Promise<unknown | IUserResponse>;
  getUserById(id: string): Promise<unknown | IUserResponse>;
  getUserByEmail(email: string): Promise<unknown | IUserResponse>;
  getUnfilteredUsers(id: string): Promise<Array<IUsersResponse> | unknown>;
  getFilteredUsers(
    page: number,
    limit: number,
    search: string,
    order: {
      name?: string;
      order?: string;
    }
  ): Promise<Array<IUsersResponse> | unknown>;
}
