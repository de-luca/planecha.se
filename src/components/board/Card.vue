<template>
  <img :src="imgSrc">
</template>

<script lang="ts">
import { Card as ModelCard } from '@/model/card';
import { Vue, prop } from 'vue-class-component';

class Props {
  public card = prop<ModelCard>({ required: true });
}

export default class Card extends Vue.with(Props) {
  public get imgSrc(): string {
    return `/cards/${this.card.id}.png`;
  }
}
</script>

<style lang="scss" scoped>
</style>
