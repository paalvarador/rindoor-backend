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
import {
  IServerToClientEvents,
  IClientToServerEvents,
  IMessage,
  IUser,
} from '../shared/interfaces/chat.interface';
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

  @WebSocketServer() server: Server = new Server<
    IServerToClientEvents,
    IClientToServerEvents
  >();

  private logger = new Logger('ChatGateway');

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.userService.removeUserFromAllRooms(socket.id);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: IMessage,
  ): Promise<IMessage> {
    this.logger.log(payload);
    this.server.to(payload.roomName).emit('chat', payload); // broadcast messages
    return payload;
  }

  @SubscribeMessage('join_room')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      roomName: string;
      user: IUser;
    },
  ) {
    if (payload.user.socketId) {
      this.logger.log(
        `${payload.user.socketId} is joining ${payload.roomName}`,
      );
      await this.server.in(payload.user.socketId).socketsJoin(payload.roomName);
      await this.userService.addUserToRoom(payload.roomName, payload.user);
    }
  }

  /*
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
  } */
}
