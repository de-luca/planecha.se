export interface OnlineInterface {
    create(): Promise<string>;
    join(roomId: string): void;
}