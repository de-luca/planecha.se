<template>
  <div class="container">
    <h1 class="title">CREATE GAME</h1>

    <ButtonPicker
      label="Local or online game?" 
      :options="scopeOptions"
      v-model="scope"
    />
    
    <ButtonPicker
      label="Game mode:" 
      :options="modeOptions"
      v-model="mode"
    />

    <div class="field create-game">
      <div class="control">
        <button :disabled="isDisabled" @click="click" class="button is-dark">Create game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonPicker, { Option } from '../components/ButtonPicker.vue';

enum GameScope {
  LOCAL = 'local',
  ONLINE = 'online',
}

enum GameMode {
  CLASSIC = 'classic',
  ETERNITIES = 'eternities',
}

const scopeOptions: Array<Option> = [{
  label: 'Local',
  value: GameScope.LOCAL,
}, {
  label: 'Online',
  value: GameScope.ONLINE,
}];

const modeOptions: Array<Option> = [{
  label: 'Classic',
  value: GameMode.CLASSIC,
  help: 'Rule 901.15. Single Planar Deck Option.',
}, {
  label: 'Eternities',
  value: GameMode.ETERNITIES,
  help: 'The <a href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
}];

export default defineComponent({
  name: 'CreateGame',
  components: {
    ButtonPicker,
  },
  data: () => ({
    scopeOptions,
    modeOptions,
    scope: GameScope.LOCAL,
    mode: GameMode.CLASSIC,
  }),
  computed: {
    isDisabled(): boolean {
      return this.scope === GameScope.ONLINE
        || this.mode === GameMode.ETERNITIES;
    },
  },
  methods: {
    click() {
      console.log("COUCOU");
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
</style>