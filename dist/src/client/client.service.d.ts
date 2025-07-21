import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
export declare class ClientService {
    private readonly databaseService;
    private readonly userService;
    private readonly mailService;
    constructor(databaseService: DatabaseService, userService: UserService, mailService: MailService);
    create(createClientDto: CreateClientDto): Promise<{
        email: string;
        id: string;
        userId: string;
        companyName: string;
        address: string | null;
        rcNumber: string | null;
    }>;
    findAll(): Promise<{
        email: string;
        id: string;
        userId: string;
        companyName: string;
        address: string | null;
        rcNumber: string | null;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        userId: string;
        companyName: string;
        address: string | null;
        rcNumber: string | null;
    }>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<{
        email: string;
        id: string;
        userId: string;
        companyName: string;
        address: string | null;
        rcNumber: string | null;
    }>;
    remove(id: string): Promise<{
        email: string;
        id: string;
        userId: string;
        companyName: string;
        address: string | null;
        rcNumber: string | null;
    }>;
}
