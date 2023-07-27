import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const jwt = client.handshake.headers.authentication as string;

    let jwtPayload: JwtPayload;

    try {
      jwtPayload = this.jwtService.verify(jwt);

      await this.messagesWsService.registerClient(client, jwtPayload.userId);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.unregisterClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('client-message')
  onClientMessage(client: Socket, payload: NewMessageDto) {
    // // envia a todos menos al cliente inicial
    // client.broadcast.emit('server-message', {
    //   fullname: 'name',
    //   message: payload.message,
    // });

    // // envia al mismo cliente
    // client.emit('server-message', {
    //   fullname: 'name',
    //   message: payload.message,
    // });

    // envia a todos
    const { fullname } = this.messagesWsService.getUserBySocketId(client.id);

    this.wss.emit('server-message', {
      fullname,
      message: payload.message,
    });
  }
}
