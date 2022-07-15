import { describe, it, expect } from 'vitest';
import { Card } from './Card';

class TestCard extends Card {
  public get type(): string {
    throw new Error('Method not implemented.');
  }
  public chaos(): void {
    throw new Error('Method not implemented.');
  }
  public enter(): void {
    throw new Error('Method not implemented.');
  }
  public leave(): void {
    throw new Error('Method not implemented.');
  }
}

describe('Card.export', () => {
  it('exports the state of the card', () => {
    const card = new TestCard({
      id: '00000000-0000-0000-0000-000000000000',
      oracleId: '12345',
      multiverseIds: [1, 2 ,3],
      name: 'Test Card',
      scryfallUri: 'https://test.card/',
      typeLine: 'test type',
      oracleText: 'some test text',
      gathererUri: 'https://test.card/',
    });

    expect(card.export()).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
    });
  });
});
