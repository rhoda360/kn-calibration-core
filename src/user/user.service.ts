import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';
import { hashSecret } from '../common/utils/hash-secret.util';
import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { generateUserName } from '../utils/create-username.util';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      // Check if the user already exists in both the user and client tables
      const userExists = await this.databaseService.$transaction(
        async (prisma) => {
          const user = await prisma.user.findUnique({
            where: {
              email: createUserDto.email,
            },
          });
          const client = await prisma.client.findUnique({
            where: {
              email: createUserDto.email,
            },
          });
          return user || client;
        },
      );

      if (userExists) {
        throw new ConflictException('User with this email already exists');
      }

      // Generate a unique username
      let username = '';

      // Keep trying until we generate a username that doesn't exist
      while (true) {
        const candidate = generateUserName(createUserDto.role.toUpperCase());
        const existing = await this.databaseService.user.findUnique({
          where: { username: candidate },
        });

        if (!existing) {
          username = candidate;
          break;
        }
      }

      // Save password
      const password = createUserDto.password;

      // Make sure password is hashed before saving to the database
      if (createUserDto.password) {
        const hashedPassword = await hashSecret(createUserDto.password);
        createUserDto.password = hashedPassword;
      }

      const createdUser = await this.databaseService.user.create({
        data: {
          ...createUserDto,
          username,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
        },
      });

      // If the user is created successfully, send a welcome email
      if (
        createdUser.role === UserRole.AGENT ||
        createdUser.role === UserRole.ADMIN
      ) {
        await this.mailService.sendAccountCreationEmail(
          createdUser.email,
          createdUser.firstName,
          createdUser.email,
          createdUser.role,
          password,
        );
      }

      return createdUser;
    } catch (error) {
      // Handle specific prisma errors
      if (error.code === 'P2002') {
        throw new ConflictException('User already exists');
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async createWithTx(
    prisma: PrismaClient | Prisma.TransactionClient,
    createUserDto: CreateUserDto,
  ) {
    // Check if the user already exists in both the user and client tables
    const userExists = await this.databaseService.$transaction(
      async (prisma) => {
        const user = await prisma.user.findUnique({
          where: {
            email: createUserDto.email,
          },
        });
        const client = await prisma.client.findUnique({
          where: {
            email: createUserDto.email,
          },
        });
        return user || client;
      },
    );

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate a unique username
    let username = '';

    // Keep trying until we generate a username that doesn't exist
    while (true) {
      const candidate = generateUserName(createUserDto.role.toUpperCase());
      const existing = await this.databaseService.user.findUnique({
        where: { username: candidate },
      });

      if (!existing) {
        username = candidate;
        break;
      }
    }

    // Save password
    const password = createUserDto.password;

    // Make sure password is hashed before saving to the database
    if (createUserDto.password) {
      const hashedPassword = await hashSecret(createUserDto.password);
      createUserDto.password = hashedPassword;
    }

    const data = { ...createUserDto, username };

    // Create the user with the provided data

    return await prisma.user.create({ data });
  }

  async findAll(role?: UserRole) {
    try {
      // If a role is provided, filter users by that role
      if (role) {
        const users = await this.databaseService.user.findMany({
          where: {
            role,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            avatarUrl: true,
          },
        });

        if (!users || users.length === 0) {
          throw new NotFoundException('No users found with the specified role');
        }

        return users;
      }

      // If no role is provided, return all users
      const users = await this.databaseService.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
        },
      });
      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }

      return users;
    } catch (error) {
      // Handle specific prisma errors
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid role provided');
      }

      throw new BadRequestException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.databaseService.user.update({
        where: {
          id,
        },
        data: {
          ...updateUserDto,
        },
      });
    } catch (error) {
      // Handle specific prisma errors
      if (error.code === 'P2002') {
        throw new ConflictException('User already exists');
      } else if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async updatePassword(id: string, password: string) {
    return await this.databaseService.user.update({
      where: { id },
      data: { password },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return await this.databaseService.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async remove(id: string) {
    try {
      // Check if the user exists before attempting to delete
      const user = await this.databaseService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete the user
      return await this.databaseService.user.delete({
        where: {
          id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
        },
      });
    } catch (error) {
      // Handle specific prisma errors
      if (error.code === 'P2003') {
        throw new BadRequestException('User cannot be deleted');
      } else if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to delete user');
    }
  }
}
