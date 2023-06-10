<template>
  <component :is="comp" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { Component as VueComponent } from 'vue';
import { useMain } from '#/store/main';

import Board from '#/components/game/Board.vue';
import Join from '#/components/game/Join.vue';

@Component({ components: { Board, Join } })
export default class Game extends Vue {
  private store = useMain();

  public get comp(): VueComponent {
    if (this.$route.params.roomId && (!this.store.ready || !this.store._map)) {
      return Join;
    }
    return Board;
  }
}
</script>
