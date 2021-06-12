<template>
  <div class="over">
    <h1 class="title" v-if="title" v-html="title"></h1>
    <div class="revealed">
      <template v-for="c in revealed.relevant" :key="c.id">
        <div class="card-wrapper">
          <img :src="buildImgSrc(c)">
          <label>TOP<input type="radio" v-model="picked[c.id]" :value="true"></label>
          <label>BOTTOM<input type="radio" v-model="picked[c.id]" :value="false"></label>
        </div>
      </template>
    </div>
    <button 
      class="button is-dark is-medium" 
      @click="confirm"
      :disabled="!allSet"
    >
      Confirm choice
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { BaseReveal, PickedLeft } from './BaseReveal';
import { Card } from '@/model/card';

@Options({
  emits: ['done'],
})
export default class Scry extends Vue.with(BaseReveal) {
  private picked: Record<string, boolean> = {};

  public get allSet(): boolean {
    return this.revealed.relevant.every(c => this.picked[c.id] !== undefined);
  }

  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.png`;
  }

  public confirm(): void {
    const result: PickedLeft = { picked: [], left: [] };
    
    result.left.push(...this.revealed.others);
    this.revealed.relevant
      .forEach(c => (this.picked[c.id] ? result.picked : result.left)
      .push(c))
    
    this.$emit('done', result);
  }
}
</script>

<style lang="scss" scoped>
.over {
  background-color: #ffffffb5;
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
      height: 20rem;
    }
  }
}
</style>
