import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/:id/:role')
  async findOne(@Param() params: any): Promise<Chat[]> {
    const { id, role } = params;

    console.log(`id: ${id}`);
    console.log(`role: ${role}`);

    return role === 'Client'
      ? await this.chatService.getMessagesForClient(id)
      : await this.chatService.getMssageForProfessional(id);
  }

  @Get('conversations/:id/:role')
  async getConversations(
    @Param() params: any,
  ): Promise<{ id: string; name: string }[]> {
    const { id, role } = params;

    console.log(`id: ${id}`);

    return await this.chatService.getListOfConversations(id, role);
  }
}
