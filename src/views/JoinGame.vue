<template>
  <div class="container">
    <h1 class="title">JOIN GAME</h1>
    <h2 class="subtitle">
      or <router-link to="/create">Create a game</router-link>
    </h2>

    <form @submit.prevent="join">
      <div class="field">
        <label class="label">Room ID:</label>
        <div class="control">
          <input 
            v-model="roomId" 
            class="input" 
            type="text" 
            placeholder="00000000-0000-0000-0000-000000000000" 
            required
            pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
          >
        </div>
      </div>

      <div class="field">
        <label class="label">Your player name:</label>
        <div class="control">
          <input 
            v-model="name" 
            class="input" 
            type="text" 
            placeholder="Super Cake" 
            required
          >
        </div>
      </div>

      <div class="field join-game">
        <div class="control">
          <button class="button is-dark" type="submit">Join game</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ActionTypes, Store, useStore } from '@/store';
import { Vue } from 'vue-class-component';

export default class JoinGame extends Vue {
  private store: Store;
  private roomId: string;
  private name: string;

  public created() {
    this.store = useStore();
    this.roomId = '';
    this.name = '';
  }
  
  public async join() {
    await this.store.dispatch(ActionTypes.JOIN, { roomId: this.roomId, name: this.name });
    this.$router.push('/board');
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 2rem;
}

.field.join-game button {
  width: 150px;
}
</style>
