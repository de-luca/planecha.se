<template>
  <div class="container">
    <h1 class="title">CREATE GAME</h1>
    <h2 class="subtitle">
      or <router-link to="/join">Join a game</router-link>
    </h2>

    <form @submit.prevent="create">
      <ButtonPicker
        label="Game mode:"
        :options="modeOptions"
        v-model="mode"
      />

      <ButtonPicker
        label="Local or online game?"
        :options="scopeOptions"
        v-model="scope"
      />

      <div class="field" v-if="requireName">
        <label class="label">Your player name:</label>
        <div class="control">
          <input v-model="name" class="input" type="text" placeholder="Super Cake" required>
        </div>
      </div>

      <div class="field create-game">
        <div class="control">
          <button class="button is-dark" type="submit">Create game</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { useStore, Store, ActionTypes } from '@/store';
import { Options, Vue } from 'vue-class-component';
import ButtonPicker, { Option } from '@/components/ButtonPicker.vue';
import { MapType } from '@/model/map/MapInterface';

enum GameScope {
  LOCAL = 'local',
  ONLINE = 'online',
}

@Options({
  components: { ButtonPicker },
})
export default class CreateGame extends Vue {
  public scopeOptions: Array<Option> = [{
    label: 'Local',
    value: GameScope.LOCAL,
  }, {
    label: 'Online',
    value: GameScope.ONLINE,
  }];
  public modeOptions: Array<Option> = [{
    label: 'Classic',
    value: MapType.CLASSIC,
    help: 'Rule 901.15. Single Planar Deck Option.',
  }, {
    label: 'Eternities',
    value: MapType.ETERNITIES,
    help: 'The <a href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
  }];

  public scope: GameScope = GameScope.LOCAL;
  public mode: MapType = MapType.CLASSIC;
  public name: string;
  
  private store: Store;

  public created() {
    this.store = useStore();
    this.name = '';
  }

  public get requireName(): boolean {
    return this.scope === GameScope.ONLINE;
  }

  public async create() {
    await this.store.dispatch(ActionTypes.INIT, {
      type: this.mode,
      online: this.scope === GameScope.ONLINE,
      advanced: {
        name: this.name,
      },
    });

    this.$router.push('/board');
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 2rem;
}

.scope-block {
  display: flex;
  gap: 1rem;
}

.advanced-block {
  label.checkbox {
    display: block;
  }
}

.field.create-game button {
  width: 150px;
}
</style>
