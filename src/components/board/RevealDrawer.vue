<template>
  <div class="over">
    <h1 class="title" v-if="title" v-html="title"></h1>
    <div class="revealed">
      <template v-for="c in revealed.cards" :key="c.id">
        <div class="card-wrapper">
          <img :src="buildImgSrc(c)">
          <button-picker v-if="!justShow" v-model="picked[c.id]" :options="modeOptions" />
        </div>
      </template>
    </div>
    <button 
      class="button is-dark is-medium" 
      @click="confirm"
      :disabled="!justShow && !allSet"
    >
      {{ justShow ? 'Okay' : 'Confirm choice' }}
    </button>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { Card } from '@/model/card';
import { Revealed } from '@/model/map/MapInterface';
import ButtonPicker, { Option } from '@/components/ButtonPicker.vue';

export type PickedLeft = {
  picked: Array<Card>;
  left: Array<Card>;
}

class Props {
  public revealed = prop<Revealed>({ required: true });
  public justShow = prop<boolean>({ required: false, default: false });
  public title = prop<string>({ required: false });
}

@Options({
  emits: ['done'],
  components: { ButtonPicker },
})
export default class RevealDrawer extends Vue.with(Props) {
  public modeOptions: Array<Option<boolean>> = [{
    label: 'Keep on top',
    value: true,
  }, {
    label: 'Move to bottom',
    value: false,
  }];
  
  private picked: Record<string, boolean> = {};
  
  public get allSet(): boolean {
    return this.revealed.cards.every((c) => {
      return this.picked[c.id] !== undefined;
    });
  }

  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.png`;
  }

  public confirm(): void {
    const result: PickedLeft = { picked: [], left: [] };
    this.revealed.cards.forEach((c) => {
      if (this.picked[c.id]) {
        result.picked.push(c);
      }
    });
    this.revealed.revealed.forEach((c) => {
      if (!this.picked[c.id]) {
        result.left.push(c);
      }
    });

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
