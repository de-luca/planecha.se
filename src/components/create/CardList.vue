<template>
  <tippy
    class="panel-block sub"
    v-for="card in cards"
    :key="card.id"
    placement="bottom-end"
    duration="0"
    touch="false"
    hideOnClick="false"
  >
    <span>{{ card.name }}</span>
    <span>
      <span class="tag is-light">{{ getType(card) }}</span>
    </span>

    <template #content>
      <img loading="lazy" class="card-preview" :src="buildImgSrc(card)">
    </template>
  </tippy>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { Card, Plane } from '#/model/card';
import { Imgable } from '#/components/Imgable';
import { CardProvider } from '#/services/CardProvider';

@Component
export default class CardList extends Imgable {
  @Prop({ required: true })
  public list: Array<string>;

  public get cards(): Array<Card> {
    return CardProvider.getCardList(this.list);
  }

  public getType(card: Card): string {
    return card instanceof Plane ? 'Plane' : 'Phenomenon';
  }
}
</script>

<style lang="scss" scoped>
.panel-block.sub {
  color: var(--text-color);

  &:not(:last-of-type) {
    border: none;
  }
  &:last-of-type {
    border-radius: unset;
    border-bottom-color: var(--border-color);
  }

  &:hover {
    background-color: var(--secondary);
  }

  span {
    flex: 1 1 0px;
    align-self: center;

    .tag {
      color: var(--secondary);
      background-color: var(--primary);
    }
  }
}
</style>
