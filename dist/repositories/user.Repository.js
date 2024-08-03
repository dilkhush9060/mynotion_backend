"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const errors_1 = require("../api/errors");
const config_1 = require("../config");
class UserRepository {
    // create user
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.create({
                    data,
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // update user by id
    updateUserById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.update({
                    where: {
                        id,
                    },
                    data,
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // update user by email
    updateUserByEmail(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.update({
                    where: {
                        email,
                    },
                    data,
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // delete user by id
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.delete({
                    where: {
                        id,
                    },
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // delete user by email
    deleteUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.delete({
                    where: {
                        email,
                    },
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // get user by id
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.findUnique({
                    where: {
                        id,
                    },
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // get user by email
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // get user by token
    getUserByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.findFirst({
                    where: {
                        token,
                    },
                });
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // get unfiltered users
    getUnfilteredUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield config_1.prisma.user.findMany();
                return user;
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
    // get filtered user
    getFilteredUsers(page, limit, search, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield config_1.prisma.user.findMany({
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
                const usersCount = yield config_1.prisma.user.count({
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
            }
            catch (error) {
                throw new errors_1.DatabaseError(error.message, error);
            }
        });
    }
}
exports.userRepository = new UserRepository();
