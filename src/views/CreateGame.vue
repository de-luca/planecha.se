<template>
  <div class="container">
    <h1 class="title">CREATE GAME</h1>

    <div class="field game-scope">
      <label class="label">Local or online game?</label>
      <div class="control">
        <input id="local" type="radio" name="game-scope" default checked>
        <label for="local" class="button">Local</label>
        <input id="online" type="radio" name="game-scope">
        <label for="online" class="button">Online</label>
      </div>
    </div>

    <div class="field game-mode">
      <label class="label">Game mode:</label>
      <div class="control">
        <input id="classic" type="radio" name="game-mode" default checked>
        <label for="classic" class="button">Planechase</label>
        <input id="eternities" type="radio" name="game-mode">
        <label for="eternities" class="button">Eternities Map</label>
      </div>
      <p class="help">Rule 901.15. Single Planar Deck Option.</p>
      <p class="help">
        The <a href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.
      </p>
    </div>

    <div class="field create-game">
      <div class="control">
        <button class="button is-dark">Create game</button>
      </div>
    </div>


    <p><code>{{ peerId }}</code></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Peer, { DataConnection } from 'peerjs';

let peer: Peer;

export default defineComponent({
  name: 'CreateGame',
  data: () => ({
    peerId: undefined,
  }),
  // created: function() { this.connect() },
  methods: {
    connect() {
      peer = new Peer();
      peer.on('open', (id) => {
        this.peerId = id;
        console.log('connected');
      });
    },
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 2rem;
}

.field.create-game button {
  width: 150px;
}

.field.game-scope .control,
.field.game-mode .control {
  display: inline-flex;
  gap: 1rem;

  label {
    width: 150px;
  }
}

input[type="radio"] {
  display: none;

  &:checked+label {
    border-color: #4a4a4a;
    color: #363636;
  }
}
</style>