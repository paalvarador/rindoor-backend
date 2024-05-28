import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/User.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Postulation]), UserModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
