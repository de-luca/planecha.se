<template>
  <div>
    <template v-for="l in logs" :key="l">
      <p>{{ l }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import { Store, useStore } from '@/store';
import { Vue } from 'vue-class-component';

export default class Logs extends Vue {
  public store: Store;

  public get logs(): Array<string> {
    return this.store.getters.logs.map((l) => {
      return `${l.initiator} ${l.type} ${(l.outcome ?? []).join(' & ')}`;
    });
  }

  public created() {
    this.store = useStore();
  }
}
</script>

<style lang="scss" scoped>
</style>
