export class RoomDoesNotExistsError extends Error {
  public name = 'Beacon Error';
  public message = `
    The given Game ID does not exists.<br>
    Either the game does not exists or it has expired.
  `;

  public constructor() {
    super();
    Object.setPrototypeOf(this, RoomDoesNotExistsError.prototype);
  }
}
