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

      <div class="field">
        <a @click.prevent="toggleAdvanced">Customize deck list</a>
      </div>

      <card-picker v-if="showAdvanced" v-model="cards" />

      <div class="field create-game">
        <div class="control">
          <button class="button is-dark" type="submit">Create game</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore, Store, ActionTypes } from '@/store';
import { MapType } from '@/model/map/MapInterface';
import ButtonPicker, { Option } from '@/components/ButtonPicker.vue';
import CardPicker from '@/components/CardPicker.vue';


enum GameScope {
  LOCAL = 'local',
  ONLINE = 'online',
}

@Options({
  components: { ButtonPicker, CardPicker },
})
export default class CreateGame extends Vue {
  public scopeOptions: Array<Option<string>> = [{
    label: 'Local',
    value: GameScope.LOCAL,
  }, {
    label: 'Online',
    value: GameScope.ONLINE,
  }];
  public modeOptions: Array<Option<string>> = [{
    label: 'Classic',
    value: MapType.CLASSIC,
    help: 'Rule 901.15. Single Planar Deck Option.',
  }, {
    label: 'Eternities',
    value: MapType.ETERNITIES,
    help: 'The <a target="_blank" rel="noopener noreferrer" href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
  }];

  private scope: GameScope = GameScope.LOCAL;
  private mode: MapType = MapType.CLASSIC;
  private name: string = '';
  private cards: Set<string> = new Set();
  private showAdvanced: boolean = false;
  
  private store: Store;

  public created() {
    this.store = useStore();
  }

  public get requireName(): boolean {
    return this.scope === GameScope.ONLINE;
  }

  public toggleAdvanced(event: any): void {
    this.showAdvanced = !this.showAdvanced;
  }

  public async create() {
    await this.store.dispatch(ActionTypes.INIT, {
      type: this.mode,
      online: this.scope === GameScope.ONLINE,
      advanced: {
        name: this.name,
        cards: this.cards.size !== 0 ? this.cards : undefined,
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
