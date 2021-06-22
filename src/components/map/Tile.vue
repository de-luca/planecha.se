<template>
  <div class="tile">
    <div
      v-if="tile && state === 'planeswalkable'"
      :class="state"
      @click="planeswalk"
      title="Planeswalk"
    >
      <card :card="tile.plane[0]" />
    </div>

    <div
      v-else-if="tile"
      :class="state"
      :title="state === 'current' ? 'You are here ;)' : ''"
    >
      <card :card="tile.plane[0]" />
    </div>

    <div
      v-else-if="!tile && state === 'hellrideable'"
      :class="state"
      @click="planeswalk"
      title="Hellride"
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 54 100'>
        <path d='M0 50.247l.156-1.969h-.061l.061-.032 2.059-26.239s1.026 18.147 4.085 23.392c1.313-.519 2.647-.984 4.002-1.403 3.306-8.657 4.467-34.379 4.467-34.379s.772 23.434 3.681 32.529c1.595-.239 3.218-.407 4.872-.51 3.007-11.188 3.824-41.636 3.824-41.636s.991 30.521 3.953 41.673c1.576.114 3.127.292 4.653.528 2.873-9.06 4.024-32.597 4.024-32.597s.931 25.864 3.941 34.449c1.319.409 2.617.871 3.89 1.376 3.338-5.179 4.513-23.388 4.513-23.388l1.592 26.224.067.034h-.063l.118 1.947s-26.689 8.691-26.689 49.485c0-40.601-27.146-49.485-27.146-49.485' fill='#000'/>
      </svg>
    </div>

    <div v-else></div>
  </div>
</template>

<script lang="ts">
import { ActionTypes, Store, useStore } from '@/store';
import { Options, prop, Vue } from 'vue-class-component';
import { Tile as TileModel } from '@/model/map/MapInterface';
import Card from '@/components/map/Card.vue';

enum State {
  PLANESWALKABLE = 'planeswalkable',
  HELLRIDEABLE = 'hellrideable',
  CURRENT = 'current',
  UNREACHABLE = 'unreachable',
}

class Props {
  public tile = prop<TileModel>({ required: false });
  public x = prop<number>({ required: true });
  public y = prop<number>({ required: true });
}

@Options({
  components: { Card },
})
export default class Tile extends Vue.with(Props) {
  private store: Store;

  public created(): void {
    this.store = useStore();
  }

  public get state(): State {
    if (this.tile) {
      if (Math.abs(this.x) + Math.abs(this.y) === 0) {
        return State.CURRENT;
      }

      if (Math.abs(this.x) + Math.abs(this.y) === 1) {
        return State.PLANESWALKABLE;
      }
    }

    if (
      !this.tile &&
      Math.abs(this.x) + Math.abs(this.y) === 2
      && Math.abs(this.x) === 1
      && Math.abs(this.y) === 1
    ) {
      return State.HELLRIDEABLE;
    }

    return State.UNREACHABLE;
  }

  public planeswalk(): void {
    this.store.dispatch(ActionTypes.PLANESWALK, {
      coordinates: { x: this.x, y: this.y },
    });
  }
}
</script>

<style lang="scss" scoped>
@keyframes scale-center {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(2.5);
  }
}


.current {
  // transform: scale(2);
  z-index: 2;
  filter: drop-shadow(5px 5px 5px red)
          drop-shadow(-5px -5px 5px red);

  &:hover {
    z-index: 3;
    filter: none;
    animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
}

.planeswalkable {
  filter: drop-shadow(2px 2px 2px grey)
          drop-shadow(-2px -2px 2px grey);

  &:hover {
    z-index: 3;
    cursor: pointer;
    filter: none;
    animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
}

.unreachable {
  filter: grayscale(1);

  &:hover {
    z-index: 3;
    animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
}

.hellrideable {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;

  svg {
    max-height: 10rem;

    path {
      fill: darkgrey;
    }
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: grey;
    }
  }
}
</style>
