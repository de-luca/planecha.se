class PeerLog {
  public readonly time: number;
  public readonly state: string;
  public readonly value: string;

  public constructor(time: number, state: string, value: string) {
    this.time = time;
    this.state = state;
    this.value = value;
  }

  public static fromString(raw: string): PeerLog {
    const parts = raw.split(':');
    return new PeerLog(parseInt(parts[0]), parts[1], parts[2]);
  }

  public toString(): string {
    return `${this.time}:${this.state}:${this.value}`;
  }
}

export class PeerLogs {
  private logs: Array<PeerLog>;

  public constructor() {
    this.logs = [];
  }

  public static fromHash(hash: string): PeerLogs {
    const logs = new PeerLogs();
    atob(hash)
      .split('\n')
      .forEach(raw => logs.push(PeerLog.fromString(raw)));

    return logs;
  }

  push(log: PeerLog): void;
  push(state: string, value: string): void;
  public push(logOrState: string | PeerLog, value?: string): void {
    if (typeof logOrState === 'string' && value) {
      this.logs.push(new PeerLog(Date.now(), logOrState, value));
    } else {
      this.logs.push(logOrState as PeerLog);
    }
  }

  public toString(): string {
    return this.sort()
      .logs
      .reduce((acc, log) => {
        acc.push(log.toString());
        return acc;
      }, [] as Array<string>)
      .join('\n');
  }

  public hash(): string {
    return btoa(this.sort().toString());
  }

  private sort(): PeerLogs {
    this.logs.sort((a, b) => a.time - b.time);
    return this;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PeerLogs = PeerLogs;
