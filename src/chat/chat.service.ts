import { Injectable } from '@nestjs/common';
import { AddMessageDto } from './dto/add-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/User.entity';
import { Role } from 'src/user/entities/Role.enum';
import { Postulation } from 'src/postulations/entities/postulation.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Postulation)
    private postulationRepository: Repository<Postulation>,
  ) {}

  async createMessage(
    userFrom: string,
    userTo: string,
    message: string,
  ): Promise<Chat> {
    const userFromExists = await this.userRepository.findOneBy({
      id: userFrom,
    });
    const userToExists = await this.userRepository.findOneBy({ id: userTo });
    if (!userFromExists || !userToExists) {
      console.log('User does not exist');
      return;
    }
    if (userFrom === userTo) {
      console.log('User cannot send message to self');
      return;
    }
    if (
      userFromExists.role === Role.CLIENT &&
      userToExists.role === Role.CLIENT
    ) {
      console.log('Client cannot send message to client');
      return;
    }
    if (
      userFromExists.role === Role.PROFESSIONAL &&
      userToExists.role === Role.PROFESSIONAL
    ) {
      console.log('Professional cannot send message to professional');
      return;
    }

    const chatMessage = this.chatRepository.create({
      message,
      from: userFromExists,
      to: userToExists,
    });
    console.log('********+PAYLOAD*************', chatMessage);

    return await this.chatRepository.save(chatMessage);
  }

  async getMessagesForClient(userFrom: string): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { from: { id: userFrom } },
      order: { createdAt: 'ASC' },
    });
  }

  async getMssageForProfessional(userTo: string): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { to: { id: userTo } },
      order: { createdAt: 'ASC' },
    });
  }

  async getMessagesForChat(userFrom: string, userTo: string): Promise<Chat[]> {
    const messages = await this.chatRepository.find({
      where: [
        { from: { id: userFrom }, to: { id: userTo } },
        { from: { id: userTo }, to: { id: userFrom } },
      ],
      order: { createdAt: 'ASC' },
      relations: ['from', 'to'],
    });

    return messages;
  }

  async getConctacts(userFrom: string): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userFrom },
      relations: ['contacts'],
    });
    if (!user) return [];
    if (!user.contacts) return [];
    return user.contacts;
  }
}
