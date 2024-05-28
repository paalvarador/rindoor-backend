import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { AddMessageDto } from './dto/add-message.dto';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server = new Server();

  private logger = new Logger('ChatGateway');

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('chat')
  async handleMessage(
    @MessageBody()
    payload: AddMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`user: ${payload.userFrom}`);
    this.logger.log(`body: ${payload.userTo}`);
    this.logger.log(`body: ${payload.message}`);

    const newMessage = await this.chatService.createMessage(
      payload.userFrom,
      payload.userTo,
      payload.message,
    );
    this.server.emit(
      `message_${payload.userFrom}_${payload.userTo}`,
      newMessage,
    );
  }
}
