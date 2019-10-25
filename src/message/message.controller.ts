import { Body, Controller, Get, Post } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { QueueService } from '../queue/queue.service';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { isValidHex, Logger } from '../utils';

import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  private log: Logger;

  constructor(
    private readonly config: ConfigService,
    private readonly messageService: MessageService,
    private readonly queueService: QueueService,
    private readonly userRepo: UserRepository,
    private readonly userService: UserService,
  ) {
    this.log = new Logger('MessageController', this.config.logLevel);
  }

  @Post('public')
  async doPublicMessage(@Body() body: any): Promise<string> {
    this.log.debug(`Got body: ${JSON.stringify(body)}`);
    const { address, message, recipientId, token } = body;
    if (!address || !message || !recipientId || !token) {
      return 'Invalid Body, expected fields: address, message, recipientId, token';
    }
    if (!isValidHex(address, 20)) {
      return 'Invalid Address, expected 20 byte hex';
    }
    if (!(await this.userService.verifySig(address, token))) {
      return 'Invalid Token';
    }
    return await this.queueService.enqueue(
      `Public message: ${message}`,
      async () => this.messageService.handlePublicMessage(
        await this.userRepo.getByAddress(address),
        await this.userRepo.findOne({ id: recipientId }),
        message,
      ),
    );
  }

  @Post('private')
  async doPrivateMessage(@Body() body: any): Promise<string> {
    this.log.debug(`Got body: ${JSON.stringify(body)}`);
    const { address, message, token, urls } = body;
    if (!address || (!message && message !== '') || !token) {
      return 'Invalid Body, expected fields: address, message, token';
    }
    if (!isValidHex(address, 20)) {
      return 'Invalid Address, expected 20 byte hex';
    }
    if (!(await this.userService.verifySig(address, token))) {
      return 'Invalid Token';
    }
    const response = await this.queueService.enqueue(
      `Private message: ${message}`,
      async () => this.messageService.handlePrivateMessage(
        await this.userRepo.getByAddress(address),
        message,
        urls || [],
      ),
    );
    if (response) {
      return response.join('\n\n');
    }
    return '';
  }

}