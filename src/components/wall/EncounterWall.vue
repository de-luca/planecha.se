<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="header">
        <p class="source">
          <em>
            <b>{{ config.mateName }}</b>
            {{ config.mateName === 'You' ? 'are' : 'is' }}
            attempting to planeswalk
          </em>
        </p>
        <h1 class="title" v-html="title"></h1>
      </div>

      <div class="roll-placeholder">
        <fa class="dice" icon="dice-d20" />
        <div v-if="rolled !== 0" class="roll" :class="{one: rolled === 1}">
          {{ rolled }}
        </div>
      </div>

      <div v-if="config.passive" class="control">
        <p class="subtitle"><b>{{ mateName }}</b> is rolling.</p>
      </div>
      <div v-else-if="triggerConfig.mechanic === 'MANUAL'" class="control">
        <button
          class="button is-danger is-medium"
          @click="encounter"
        >
          Encounter Phenomenon
        </button>
        <button
          class="button is-secondary is-medium"
          @click="planeswalk"
        >
          Planeswalk
        </button>
      </div>
      <div v-else class="control">
        <button
          v-if="rolled === 0"
          class="button is-secondary is-medium"
          @click="roll"
        >
          Roll!
        </button>
        <button
          v-else-if="rolled === 1"
          class="button is-danger is-outlined is-medium"
          @click="encounter"
        >
          Encounter Phenomenon
        </button>
        <button
          v-else
          class="button is-secondary is-medium"
          @click="planeswalk"
        >
          Planeswalk
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options, prop } from 'vue-class-component';
import { WallProps } from './WallProps';
import { Imgable } from '../Imgable';
import { EncounterMechanic, TriggerConfig, TriggerConfigEnabled } from '@/model/map/eternities';

class Props extends WallProps {
  public coords = prop<Coordinates>({ required: true });
  public triggerConfig = prop<TriggerConfig>({ required: true });
}

@Options({
  emits: [ 'planeswalk', 'encounter' ],
})
export default class EncounterWall extends mixins(Imgable).with(Props) {
  private rolled: number = 0;

  public get title(): string {
    return this.triggerConfig.enabled &&
      this.triggerConfig.mechanic === EncounterMechanic.MANUAL
        ? 'Now\'s the time to roll your dice!'
        : 'Let\'s roll for the encounter!';
  }

  public roll(): number {
    this.rolled = Math.floor(
      Math.random() * (this.triggerConfig as TriggerConfigEnabled).ratio,
    ) + 1;
    return this.rolled;
  }

  public encounter(): void {
    this.$emit('encounter', this.coords);
  }

  public planeswalk(): void {
    this.$emit('planeswalk', this.coords);
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8rem;

  .source {
    opacity: .5;
  }

  .header {
    text-align: center;
  }

  .title {
    color: var(--text-color);
  }

  .roll-placeholder {
    height: 25%;
    text-align: center;
    position: relative;

    .dice {
      height: 100%;
      width: unset;
      color: var(--brand-color-primary);
    }

    .roll {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-45%) translateX(-50%);
      font-weight: bold;
      font-size: 3em;
      color: var(--secondary);

      &.one {
        filter:
          drop-shadow(0 0 5px #DC143C)
          drop-shadow(0 0 5px #DC143C)
          drop-shadow(0 0 5px #DC143C)
        ;
      }
    }

  }

  .control {
    display: inline-flex;
    gap: 1rem;

    button {
      width: 300px;
    }
  }

  button {
    height: 100%;

    &.is-danger {
      color: var(--btn-danger-color);
      background-color: var(--btn-danger-bg);
      border-color: var(--btn-danger-border);

      &:hover {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-hover-bg);
      }

      &:active {
        color: var(--btn-danger-color);
        background-color: var(--btn-danger-active-bg);
      }
    }
  }
}
</style>
