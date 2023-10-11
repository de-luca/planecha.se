<template>
  <div class="modal" style="display: block">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="box">
        <div class="outcome">
          <div v-if="type === 'planar'" class="bg planar">
            <Planeswalk class="icn is-light" />
            <Chaos class="icn is-light chaos"/>
          </div>
          <Coin v-else-if="type === 'coin'" class="bg icn is-light" />
          <component v-else :is="dices[type]" class="bg icn is-light" />
          <div class="title">{{ outcome }}</div>
        </div>
        <button
          class="button is-primary"
          :class="{ 'is-loading': rolling }"
          :disabled="rolling"
          @click="roll"
        >
          Reroll
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component as VueComponent , markRaw } from 'vue';
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { DiceType } from '../dices';

import * as SVGs from '#/components/svgs/dices';
import { Chaos, Planeswalk } from '#/components/svgs';
import { useMain } from '#/store/main';

@Component({
  components: { ...SVGs, Chaos, Planeswalk },
  emits: ['close'],
})
export default class DiceModal extends Vue {
  @Prop({ required: true })
  public type: DiceType;

  public dices: Partial<Record<DiceType, VueComponent>> = {
    'd4': markRaw(SVGs.D4),
    'd6': markRaw(SVGs.D6),
    'd8': markRaw(SVGs.D8),
    'd10': markRaw(SVGs.D10),
    'd12': markRaw(SVGs.D12),
    'd20': markRaw(SVGs.D20),
  };

  public rolling = false;
  public outcome: string | number | null = null;

  private store = useMain();

  public created(): void {
    this.roll();
  }

  public roll(): void {
    this.rolling = true;
    this.outcome = null;
    setTimeout(() => {
      this.outcome = this.getAction()();
      this.rolling = false;
    }, 1000);
  }

  private getAction(): (...args: Array<unknown>) => string | number {
    switch (this.type) {
      case 'planar':
        return () => this.store.rollPlanarDice()
          .toLowerCase()
          .replace('_', ' ');
      case 'coin':
        return () => this.store.flipCoin().toLowerCase();
      case 'd4':
        return () => this.store.rollDice(4);
      case 'd6':
        return () => this.store.rollDice(6);
      case 'd8':
        return () => this.store.rollDice(8);
      case 'd10':
        return () => this.store.rollDice(10);
      case 'd12':
        return () => this.store.rollDice(12);
      case 'd20':
        return () => this.store.rollDice(20);
      default:
        throw new Error('What kind of dice is that?');
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  left: 5rem;
}

.modal-content {
  height: 100%;
  width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  margin: 0 auto;

  .box {
    text-align: center;
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    width: 17rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    .outcome {
      position: relative;
      height: 15rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      div:last-child {
        z-index: 1;
        text-transform: capitalize;
        color: var(--text-color) !important;
      }

      .bg {
        position: absolute;
        width: 100%;

        &.planar {
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: flex-start;

          .icn {
            max-height: 9.5rem;
            width: 50%;
          }

          .chaos {
            align-self: flex-end;
            width: 40%
          }
        }
      }
    }
  }
}
</style>
./dices
