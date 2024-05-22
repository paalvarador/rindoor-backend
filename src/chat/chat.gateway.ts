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

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
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

    // Emit to the sender
    this.server.emit(
      `message_${payload.userFrom}_${payload.userTo}`,
      newMessage,
    );

    // Emit to the receiver
    this.server.emit(
      `message_${payload.userTo}_${payload.userFrom}`,
      newMessage,
    );
  }
}
