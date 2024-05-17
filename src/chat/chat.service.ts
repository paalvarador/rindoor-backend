import { Injectable } from '@nestjs/common';
import { AddMessageDto } from './dto/add-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  async createMessage(
    userFrom: string,
    userTo: string,
    message: string,
  ): Promise<Chat> {
    const chatMessage = this.chatRepository.create({
      client: { id: userFrom },
      professional: { id: userTo },
      message,
    });

    return await this.chatRepository.save(chatMessage);
  }

  async getMessagesForClient(userFrom: string): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { client: { id: userFrom } },
      order: { createdAt: 'ASC' },
    });
  }

  async getMssageForProfessional(userTo: string): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { professional: { id: userTo } },
      order: { createdAt: 'ASC' },
    });
  }
}
