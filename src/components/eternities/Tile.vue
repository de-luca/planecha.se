<template>
  <div class="tile">
    <div
      title="Planeswalk"
      v-if="tile && state === 'planeswalkable'"
      :class="[ { multi: tile.plane.length > 1 }, state ]"
      @click="planeswalk"
    >
      <template v-for="p in tile.plane" :key="p">
        <card :card="p" />
      </template>
    </div>

    <div
      v-if="tile && state === 'hidden'"
      :class="state"
    >
      <img v-if="hidden" src="/cards/back.jpg">
    </div>

    <div
      title="Start game"
      v-if="tile && state === 'preparation'"
      :class="state"
      @click="start"
    >
      <card :card="tile.plane[0]" :current="state === 'current'" />
    </div>

    <div
      v-if="tile && state === 'current'"
      :class="[ { multi: tile.plane.length > 1 }, state ]"
      title="You are here ;)"
    >
      <template v-for="p in tile.plane" :key="p">
        <card :card="p" :current="state === 'current'" />
      </template>
    </div>

    <div
      v-if="tile && state === 'unreachable'"
      :class="[ { multi: tile.plane.length > 1 }, state ]"
    >
      <template v-for="p in tile.plane" :key="p">
        <card :card="p" :current="state === 'current'" />
      </template>
    </div>

    <div
      title="Hellride"
      v-if="!tile && !hidden && state === 'hellrideable'"
      :class="state"
      @click="hellride"
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 54 100'>
        <path d='M0 50.247l.156-1.969h-.061l.061-.032 2.059-26.239s1.026 18.147 4.085 23.392c1.313-.519 2.647-.984 4.002-1.403 3.306-8.657 4.467-34.379 4.467-34.379s.772 23.434 3.681 32.529c1.595-.239 3.218-.407 4.872-.51 3.007-11.188 3.824-41.636 3.824-41.636s.991 30.521 3.953 41.673c1.576.114 3.127.292 4.653.528 2.873-9.06 4.024-32.597 4.024-32.597s.931 25.864 3.941 34.449c1.319.409 2.617.871 3.89 1.376 3.338-5.179 4.513-23.388 4.513-23.388l1.592 26.224.067.034h-.063l.118 1.947s-26.689 8.691-26.689 49.485c0-40.601-27.146-49.485-27.146-49.485' fill='#000'/>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { Tile as TileModel } from '@/model/map/MapInterface';

import Card from '@/components/eternities/Card.vue';

enum State {
  PLANESWALKABLE = 'planeswalkable',
  HELLRIDEABLE = 'hellrideable',
  CURRENT = 'current',
  UNREACHABLE = 'unreachable',
  HIDDEN = 'hidden',
  PREPARATION = 'preparation',
}

class Props {
  public tile = prop<TileModel>({ required: false });
  public x = prop<number>({ required: true });
  public y = prop<number>({ required: true });
  public hidden = prop<boolean>({ required: true });
}

@Options({
  emits: [ 'start', 'planeswalk', 'hellride' ],
  components: { Card },
})
export default class Tile extends Vue.with(Props) {
  public get state(): State {
    if (this.tile) {
      if (Math.abs(this.x) + Math.abs(this.y) === 0) {
        return this.hidden ? State.PREPARATION : State.CURRENT;
      }

      if (Math.abs(this.x) + Math.abs(this.y) === 1) {
        return this.hidden ? State.HIDDEN : State.PLANESWALKABLE;
      }
    }

    if (
      !this.tile
      && Math.abs(this.x) + Math.abs(this.y) === 2
      && Math.abs(this.x) === 1
      && Math.abs(this.y) === 1
    ) {
      return State.HELLRIDEABLE;
    }

    return State.UNREACHABLE;
  }

  public hellride(): void {
    const coords: Coordinates = { x: this.x, y: this.y };
    this.$emit('hellride', coords);
  }

  public planeswalk(): void {
    const coords: Coordinates = { x: this.x, y: this.y };
    this.$emit('planeswalk', coords);
  }

  public start(): void {
    this.$emit('start');
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
@keyframes scale-up-br {
  0% {
    transform: scale(1);
    transform-origin: 100% 100%;
  }
  100% {
    transform: scale(2.5);
    transform-origin: 100% 100%;
  }
}
@keyframes scale-up-tl {
  0% {
    transform: scale(1);
    transform-origin: 0% 0%;
  }
  100% {
    transform: scale(2.5);
    transform-origin: 0% 0%;
  }
}

.multi {
  width: 100%;
  position: relative;

  div:first-child {
    position: absolute;
    top: -.75rem;
    left: -.75rem;
  }

  div:last-child {
    position: absolute;
    bottom: -.75rem;
    right: -.75rem;
  }

  &:hover {
    z-index: 3;

    div:first-child {
      animation: scale-up-br 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

      &:hover {
        z-index: 4;
      }
    }

    div:last-child {
      animation: scale-up-tl 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

      &:hover {
        z-index: 4;
      }
    }
  }
}

.preparation:hover {
  cursor: pointer;
}

.hidden img {
  border-radius: 3.5% / 4.7%;
}

.current, .preparation {
  z-index: 2;
  filter: drop-shadow(5px 5px 5px red)
          drop-shadow(-5px -5px 5px red);

  &:not(.multi):hover {
    z-index: 3;
    filter: none;
    animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
}

.planeswalkable {
  filter: drop-shadow(2px 2px 2px grey)
          drop-shadow(-2px -2px 2px grey);

  &:not(.multi):hover {
    z-index: 3;
    cursor: pointer;
    filter: none;
    animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
}

.unreachable {
  filter: grayscale(1);

  &:not(.multi):hover {
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
    max-height: 7rem;

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
