import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'africa/lagos',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'app.log'),
        formattedEntry,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  log(message: any, context?: string) {
    // Custom logic before logging
    const entry = `${context}\t${message}`;

    // Log to file
    //this.logToFile(entry);

    // Call the parent log method
    super.log(entry, context);
  }

  error(message: any, stackOrContext?: string) {
    // Custom logic before logging
    const entry = `${stackOrContext}\t${message}`;

    // Log to file
    //this.logToFile(entry);

    // Call the parent error method
    super.error(entry, stackOrContext);
  }
}
