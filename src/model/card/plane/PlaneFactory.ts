import type { Props } from "..";
import type { Counter } from '.';
import { Service } from 'typedi';
import { Plane } from '.';
import * as Special from './special';

type SpecialConstructor = { new(props: Props): Plane };

@Service()
export class PlaneFactory {
    private static readonly specials: Map<string, SpecialConstructor> = new Map([
        ['d6dc655e-d8ef-443a-bb3e-46c7ca1555ba', Special.Aretopolis],
        ['559007a6-c515-413a-8d3c-8ce1df0742ff', Special.PoolOfBecoming],
        ['eceba6df-8821-499b-b3c2-4d54c6eab257', Special.StairsToInfinity],
    ]);

    private static readonly counter: Map<string, Counter> = new Map([
        ['d6dc655e-d8ef-443a-bb3e-46c7ca1555ba', {
            name: "Scroll",
            value: 0,
            start: 0,
            max: 10,
            reset: true,
        }],
        ["93f386a5-08ce-4f76-944f-f38620a41027", {
            name: "Charge",
            value: 0,
            start: 0,
            max: null,
            reset: false,
        }],
        ["a4d3edeb-4a78-4de3-a167-4565c494ba23", {
            name: "Pressure",
            value: 0,
            start: 0,
            max: null,
            reset: false,
        }], 
        ["f63b82f9-ebc4-465c-b25e-5ee710525143", {
            name: "Flame",
            value: 0,
            start: 0,
            max: null,
            reset: false,
        }],    
    ]);

    /** 
     * I made it! I created the most cursed and stupid factory!
     */
    public build(props: Props): Plane {
        return new(PlaneFactory.specials.get(props.id) ?? Plane)({
            ...props,
            counter: PlaneFactory.counter.get(props.id),
        });
    }
}