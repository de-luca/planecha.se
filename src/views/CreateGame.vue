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

      <game-scope-picker v-model="scope" />

      <div class="field" v-if="requireName">
        <label class="label">Your player name:</label>
        <div class="control">
          <input v-model="name" class="input" type="text" placeholder="Super Cake" required>
        </div>
      </div>

      <div class="field">
        <a @click.prevent="toggleAdvanced">Customize deck list</a>
      </div>

      <card-picker v-if="showAdvanced" v-model="cards" :group="group" />

      <div class="field create-game">
        <div class="control">
          <button
            class="button is-dark"
            :class="{ 'is-loading': creating }"
            type="submit"
            :disabled="!hasRequiredCards"
          >
            Create game
          </button>
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
import GameScopePicker from '@/components/GameScopePicker.vue';
import CardPicker, { Group } from '@/components/CardPicker.vue';
import { Card, Plane } from '@/model/card';


enum GameScope {
  LOCAL = 'local',
  ONLINE = 'online',
}

@Options({
  components: { ButtonPicker, CardPicker, GameScopePicker },
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
  private cards: Array<Card> = [];
  private showAdvanced: boolean = false;
  private creating: boolean = false;

  private store: Store;

  public created() {
    this.store = useStore();
  }

  public get requireName(): boolean {
    return this.scope === GameScope.ONLINE;
  }

  public get group(): Group {
    return this.mode === MapType.ETERNITIES
      ? Group.PLANES
      : Group.ALL;
  }

  public get hasRequiredCards(): boolean {
    if (!this.showAdvanced && this.cards.length === 0) {
      return true;
    }

    switch (this.mode) {
      case MapType.CLASSIC:
        return this.cards.filter(c => c instanceof Plane).length >= 5;
      case MapType.ETERNITIES:
        return this.cards.filter(c => c instanceof Plane).length >= 25;
      default:
        return true;
    }
  }

  public toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  public async create() {
    this.creating = true;
    await this.store.dispatch(ActionTypes.INIT, {
      type: this.mode,
      online: this.scope === GameScope.ONLINE,
      advanced: {
        name: this.name,
        cards: this.cards.length !== 0 ? this.cards.map(c => c.id) : undefined,
      },
    });
    this.creating = false;

    this.$router.push('/board');
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 2rem;
  padding-bottom: 2rem;
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
