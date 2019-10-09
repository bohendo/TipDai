import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterModule } from './twitter/twitter.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ChannelModule } from './channel/channel.module';
import { DepositModule } from './deposit/deposit.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { TipModule } from './tip/tip.module';

@Module({
  imports: [
    TwitterModule,
    WebhooksModule,
    ConfigModule,
    DatabaseModule,
    ChannelModule,
    DepositModule,
    MessageModule,
    UserModule,
    TipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
