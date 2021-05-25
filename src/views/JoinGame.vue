<template>
  <div class="container">
    <div class="field">
      <label class="label">Room ID</label>
      <div class="control">
        <input class="input" v-model="roomId" type="text" placeholder="00000000-0000-0000-0000-000000000000">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-fullwidth" @click="join">Join</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionTypes, Store, useStore } from '@/store';
import { Vue } from 'vue-class-component';

export default class JoinGame extends Vue {
  private store: Store;
  private roomId: string;

  public created() {
    this.store = useStore();
    this.roomId = '';
  }
  
  public async join() {
    await this.store.dispatch(ActionTypes.JOIN, { roomId: this.roomId });
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 2rem;
}
</style>
