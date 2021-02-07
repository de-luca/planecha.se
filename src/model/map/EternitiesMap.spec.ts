import { EternitiesMap } from ".";

describe('EternitiesMap.initializeTiles', () => {
    it('initializes board tiles', () => {
        // it's called in the constructor...
        const map = new EternitiesMap();
        expect(map['tiles']).toHaveLength(5);
    });
});

describe('EternitiesMap.planeswalk', () => {
    it('changes current active plane', () => {
        const map = new EternitiesMap();
        const currentActive = map['active'];
        map.planeswalk({ x: 1, y: 0 });
        expect(map['active']).not.toEqual(currentActive);
    });

    it('shifts the board right', () => {
        const map = new EternitiesMap();
        const tiles = map.planeswalk({ x: 1, y: 0 });
        expect(tiles).toHaveLength(8);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: -2, y: 0 } }),
                expect.objectContaining({ coordinates: { x: -1, y: -1 } }),
                expect.objectContaining({ coordinates: { x: -1, y: 1 } }),
            ]),
        );
    });

    it('shifts the board left', () => {
        const map = new EternitiesMap();
        const tiles = map.planeswalk({ x: -1, y: 0 });
        expect(tiles).toHaveLength(8);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: 2, y: 0 } }),
                expect.objectContaining({ coordinates: { x: 1, y: 1 } }),
                expect.objectContaining({ coordinates: { x: 1, y: -1 } }),
            ]),
        );
    });

    it('shifts the board up', () => {
        const map = new EternitiesMap();
        const tiles = map.planeswalk({ x: 0, y: 1 });
        expect(tiles).toHaveLength(8);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: 0, y: -2 } }),
                expect.objectContaining({ coordinates: { x: -1, y: -1 } }),
                expect.objectContaining({ coordinates: { x: 1, y: -1 } }),
            ]),
        );
    });

    it('shifts the board down', () => {
        const map = new EternitiesMap();
        const tiles = map.planeswalk({ x: 0, y: -1 });
        expect(tiles).toHaveLength(8);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: 0, y: 2 } }),
                expect.objectContaining({ coordinates: { x: -1, y: 1 } }),
                expect.objectContaining({ coordinates: { x: 1, y: 1 } }),
            ]),
        );
    });

    it('cleanup planes that are too far away', () => {
        const map = new EternitiesMap();
        
        let tiles = map.planeswalk({ x: 0, y: -1 });
        expect(tiles).toHaveLength(8);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: 0, y: 2 } }),
            ]),
        );
        
        tiles = map.planeswalk({ x: 0, y: -1 });
        expect(tiles).toHaveLength(11);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: 0, y: 3 } }),
            ]),
        );

        tiles = map.planeswalk({ x: 0, y: -1 });
        expect(tiles).toHaveLength(11);
        expect(tiles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ coordinates: { x: 0, y: 3 } }),
            ]),
        );
    });
});
