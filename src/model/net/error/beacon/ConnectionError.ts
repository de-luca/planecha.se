export class ConnectionError extends Error {
  public name = 'Beacon Error';
  public message = `
    Unable to establish connection to Planar Beacon.<br>
    Server might be dead or encountered an error. Please retry later.
  `;

  public constructor() {
    super();
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}
