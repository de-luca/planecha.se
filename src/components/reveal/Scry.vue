<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title" v-if="config.title" v-html="config.title"></h1>
      <div class="revealed">
        <template v-for="(c, index) in revealed.relevant" :key="c.id">
          <div class="card-wrapper">

            <img :src="buildImgSrc(c)">

            <div class="control" v-if="!config.passive">
              <input
                type="radio"
                :disabled="config.passive"
                :id="id + index + 'top'"
                :value="true"
                v-model="picked[c.id]"
              >
              <label class="button" :for="id + index + 'top'">
                Keep on top
              </label>

              <input
                type="radio"
                :disabled="config.passive"
                :id="id + index + 'bottom'"
                :value="false"
                v-model="picked[c.id]"
              >
              <label class="button" :for="id + index + 'bottom'">
                Put at the bottom
              </label>
            </div>

          </div>
        </template>
      </div>

      <button
        v-if="!config.passive"
        class="button is-secondary is-medium"
        @click="confirm"
        :disabled="!allSet"
      >
        Confirm choice
      </button>
      <p class="subtitle" v-if="config.passive"><b>{{ mateName }}</b> is chosing.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { BaseReveal, PickedLeft } from './BaseReveal';
import { Wall } from '../Wall';

@Options({
  emits: ['done'],
})
export default class Scry extends mixins(Wall).with(BaseReveal) {
  private picked: Record<string, boolean> = {};
  private id: string = '';

  public created(): void {
    this.id = Math.random().toString(36).substring(2, 15);
  }

  public get allSet(): boolean {
    return this.revealed.relevant.every(c => this.picked[c.id] !== undefined);
  }

  public confirm(): void {
    const result: PickedLeft = { picked: [], left: [] };

    result.left.push(...this.revealed.others);
    this.revealed.relevant
      .forEach(c => (this.picked[c.id] ? result.picked : result.left)
      .push(c));

    this.$emit('done', result);
  }
}
</script>

<style lang="scss" scoped>
.control {
  display: inline-flex;
  gap: 1rem;

  label {
    width: var(--form-btn-width);
    color: var(--modal-picker-color);
    background-color: var(--modal-picker-bg);
    border-color: var(--modal-picker-border);
  }
}

input[type="radio"] {
  display: none;

  &:checked+label {
    border-color: var(--modal-picker-checked-border);
  }
}

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
  gap: .5rem;
}

.revealed {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: center;
  gap: .5rem;

  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;

  .card-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: .5rem;

    img {
      height: 30rem;
      border-radius: var(--card-radius);
    }
  }
}
</style>
