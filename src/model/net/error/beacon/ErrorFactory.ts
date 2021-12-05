import { ConnectionError } from './ConnectionError';
import { RoomDoesNotExistsError } from './RoomDoesNotExistsError';

export abstract class ErrorFactory {
  public static fromCode(code: string): Error {
    switch (code) {
      case 'CONNECTION_FAILED':
        return new ConnectionError();
      case 'ROOM_DOES_NOT_EXISTS':
        return new RoomDoesNotExistsError();
      default:
        const err = new Error('An unexpected error occured (like every errors)');
        err.name = 'Unknown Error';
        return err;
    }
  }
}
