import { DatabaseError } from "@/api/errors";
import { prisma } from "@/config";
import {
  ICreateUser,
  IUpdateUser,
  IUserRepositories,
} from "@/types/repositories";

class UserRepository implements IUserRepositories {
  // create user
  public async createUser(data: ICreateUser) {
    try {
      const user = await prisma.user.create({
        data,
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // update user by id
  public async updateUserById(id: string, data: IUpdateUser) {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // update user by email
  public async updateUserByEmail(email: string, data: IUpdateUser) {
    try {
      const user = await prisma.user.update({
        where: {
          email,
        },
        data,
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // delete user by id
  public async deleteUserById(id: string) {
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // delete user by email
  public async deleteUserByEmail(email: string) {
    try {
      const user = await prisma.user.delete({
        where: {
          email,
        },
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // get user by id
  public async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // get user by email
  public async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // get user by token
  public async getUserByToken(token: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          token,
        },
      });
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // get unfiltered users
  public async getUnfilteredUsers() {
    try {
      const user = await prisma.user.findMany();
      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }

  // get filtered user
  public async getFilteredUsers(
    page: number,
    limit: number,
    search: string,
    order: {
      name?: string;
      order?: string;
    }
  ) {
    try {
      const users = await prisma.user.findMany({
        skip: page * limit,
        take: limit,
        orderBy: {
          [order.name || "createdAt"]: order.order || "desc",
        },
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        },
      });

      // data count
      const usersCount = await prisma.user.count({
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        },
      });

      return { users, usersCount };
    } catch (error: any) {
      throw new DatabaseError(error.message, error);
    }
  }
}
export const userRepository = new UserRepository();
