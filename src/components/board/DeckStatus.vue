<template>
  <div class="status">
    <div title="Remaining cards">
      <fa icon="layer-group" fixed-width />
      <span>{{ remaining }}</span>
    </div>
    <div title="Played cards">
      <fa icon="book-dead" fixed-width />
      <span>{{ played }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { useMain } from '@/store/main';
import { Vue } from 'vue-class-component';

export default class DeckStatus extends Vue {
  private store = useMain();

  public get remaining(): number {
    return this.store.map.remaining;
  }

  public get played(): number {
    return this.store.map.played.length;
  }

}
</script>

<style lang="scss" scoped>
.status {
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  border-style: solid;
  border-width: 1px;

  span {
    width: 2rem;
    text-align: center;
    display: inline-block;
  }

  &:not(:last-child) {
    border-right: none;

    &:not(:first-child) {
      border-left: none;
    }
  }
}
</style>
