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
    const response = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.client', 'client')
      .leftJoinAndSelect('chat.professional', 'professional')
      .where('client.id = :userFrom', { userFrom })
      .orderBy('chat.createdAt', 'ASC')
      .select([
        'chat',
        'client.id',
        'client.name',
        'professional.id',
        'professional.name',
      ])
      .getMany();

    console.log(`response: ${JSON.stringify(response)}`);

    return response;
  }

  async getMssageForProfessional(userTo: string): Promise<Chat[]> {
    console.log(`Entro en la linea 35 de chat services`);
    return await this.chatRepository.find({
      where: { professional: { id: userTo } },
      order: { createdAt: 'ASC' },
    });
  }

  async getListOfConversations(
    userId: string,
    role: string,
  ): Promise<{ id: string; name: string }[]> {
    const clientChats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.professional', 'professional')
      .where('chat.clientId = :userId', { userId })
      .select(['professional.id', 'professional.name'])
      .getRawMany();

    const professionalChats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.client', 'client')
      .where('chat.professionalId = :userId', { userId })
      .select(['client.id', 'client.name'])
      .getRawMany();

    const clientChatPartners = clientChats.map((chat) => ({
      id: chat.professional_id,
      name: chat.professional_name,
    }));
    const professionalChatPartners = professionalChats.map((chat) => ({
      id: chat.client_id,
      name: chat.client_name,
    }));

    // Concatenate and remove duplicates
    const allChatPartners = [
      ...clientChatPartners,
      ...professionalChatPartners,
    ];
    const uniqueChatPartners = Array.from(
      new Set(allChatPartners.map((partner) => partner.id)),
    ).map((id) => allChatPartners.find((partner) => partner.id === id));

    return uniqueChatPartners;
  }
}
