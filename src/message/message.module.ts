import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageService } from './message.service';

import { ChannelModule } from '../channel/channel.module';
import { ConfigModule } from '../config/config.module';
import { DepositModule } from '../deposit/deposit.module';
import { PaymentModule } from '../payment/payment.module';
import { TwitterModule } from '../twitter/twitter.module';
import { UserRepository } from '../user/user.repository';

@Module({
  providers: [MessageService],
  imports: [
    ChannelModule,
    ConfigModule,
    DepositModule,
    PaymentModule,
    TwitterModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  exports: [MessageService],
})
export class MessageModule {}
