export class PeerICEError extends Error {
  public readonly name = 'Peer-To-Peer Error';
  public readonly message = `
    Some Peer-To-Peer connection(s) failed and were aborted.<br>
    This might be due to Firewall between users preventing connections.
  `;

  public constructor() {
    super();
    Object.setPrototypeOf(this, PeerICEError.prototype);
  }
}
