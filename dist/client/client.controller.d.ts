import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
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
