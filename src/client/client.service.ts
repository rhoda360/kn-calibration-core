import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from '../database/database.service';
import { UserRole } from '@prisma/client';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  async create(createClientDto: CreateClientDto) {
    const { email, companyName, rcNumber, address, ...userData } =
      createClientDto;
    //check if the client already exists in both the client and user tables
    const clientExists = await this.databaseService.$transaction(
      async (prisma) => {
        const client = await prisma.client.findUnique({
          where: { email: createClientDto.email },
        });
        const user = await prisma.user.findUnique({
          where: { email: createClientDto.email },
        });
        return !!client || !!user;
      },
    );

    if (clientExists) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if the rcNumber is already taken
    const existingClient = await this.databaseService.client.findUnique({
      where: { rcNumber },
    });

    if (existingClient) {
      throw new ConflictException('Client with this RC Number already exists');
    }

    // Check if the email is verified
    const otp = await this.databaseService.oneTimePassword.findFirst({
      where: { email },
    });

    if (!otp || !otp.isVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    // Create both Client and User atomically
    const [user, client] = await this.databaseService.$transaction(
      async (tx) => {
        const user = await this.userService.createWithTx(tx, {
          ...userData,
          email,
          role: UserRole.CLIENT,
        });

        const client = await tx.client.create({
          data: { companyName, rcNumber, address, email, userId: user.id },
        });

        return [user, client];
      },
    );

    // If the client is created successfully, send a welcome email
    await this.mailService.sendClientCreationEmail(
      user.email,
      user.firstName,
      user.email,
      user.role,
      createClientDto.password,
    );

    return client;
  }

  async findAll() {
    return this.databaseService.client.findMany();
  }

  async findOne(id: string) {
    const client = await this.databaseService.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.databaseService.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return await this.databaseService.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string) {
    const client = await this.databaseService.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return await this.databaseService.client.delete({
      where: { id },
    });
  }
}
