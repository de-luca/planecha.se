<template>
  <div class="container">
    <h1 class="title">CREATE GAME</h1>
    <h2 class="subtitle">
      or <router-link to="/join">Join a game</router-link>
    </h2>

    <form @submit.prevent="create">

      <game-scope-picker v-model="online" />

      <div class="field" v-if="requireName">
        <label class="label">Your player name:</label>
        <div class="control">
          <input v-model="name" class="input" type="text" placeholder="Super Cake" required>
        </div>
        <p class="help">The name people in the game will see you as.</p>
      </div>


      <button-picker
        label="Game mode:"
        :options="mapTypeOptions"
        v-model="mapType"
      />

      <button-picker
        v-if="showSubType"
        label="Eternities Map deck type:"
        :options="subTypeOptions"
        v-model="subType"
      />

      <button-picker
        v-if="showDeckType"
        label="Deck composition:"
        :options="deckTypeOptions"
        v-model="deckType"
      />

      <encounter-setup v-model="encounterConfig" v-if="showDualDeckConfig" />

      <div class="field">
        <a @click.prevent="toggleAdvanced">
          <span v-if="showAdvanced">▼</span>
          <span v-else>▶</span>
          Customize deck list
        </a>
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
import {
  EncounterMechanic,
  EncounterTrigger,
  EncounterTriggers,
  EternitiesMapDeckType,
  EternitiesMapSubType,
  MapType,
} from '@/model/map';
import { Card, Plane } from '@/model/card';
import ButtonPicker, { Option } from '@/components/ButtonPicker.vue';
import CardPicker, { Group } from '@/components/create/CardPicker.vue';
import GameScopePicker from '@/components/create/GameScopePicker.vue';
import EncounterSetup from '@/components/create/EncounterSetup.vue';

@Options({
  components: {
    ButtonPicker, CardPicker,
    GameScopePicker, EncounterSetup,
  },
})
export default class CreateGame extends Vue {
  private readonly mapTypeOptions: Array<Option<string>> = [{
    label: 'Classic',
    value: MapType.CLASSIC,
    help: 'Rule 901.15. Single Planar Deck Option.',
  }, {
    label: 'Eternities Map',
    value: MapType.ETERNITIES,
    help: 'The <a target="_blank" rel="noopener noreferrer" href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
  }];
  private readonly subTypeOptions: Array<Option<string>> = [{
    label: 'Single Deck',
    value: EternitiesMapSubType.SINGLE_DECK,
    help: 'Use a single planar deck.',
  }, {
    label: 'Dual Deck',
    value: EternitiesMapSubType.DUAL_DECK,
    help: 'Use two decks, one for Planes, one for Phenomena.',
  }];
  private readonly deckTypeOptions: Array<Option<string>> = [{
    label: 'Only Planes',
    value: EternitiesMapDeckType.PLANES,
    help: 'Basic Eternities Map with Planes only.',
  }, {
    label: 'Planes and Phenomena',
    value: EternitiesMapDeckType.ALL,
    help: 'Planes and Phenomnena mixed in the same deck. Phenomena are encountered when drawn.',
  }];

  private showAdvanced: boolean = false;
  private creating: boolean = false;

  private online: boolean = false;
  private mapType: MapType = MapType.CLASSIC;
  private subType: EternitiesMapSubType = EternitiesMapSubType.SINGLE_DECK;
  private deckType: EternitiesMapDeckType = EternitiesMapDeckType.PLANES;

  private encounterConfig: EncounterTriggers = {
    [EncounterTrigger.ON_PLANESWALK]: {
      enabled: false,
      mechanic: EncounterMechanic.MANUAL,
      ratio: 6,
    },
    [EncounterTrigger.ON_HELLRIDE]: {
      enabled: true,
      mechanic: EncounterMechanic.MANUAL,
      ratio: 1,
    },
  };

  private name: string = '';
  private cards: Array<Card> = [];

  private store: Store;

  public created() {
    this.store = useStore();
  }

  public get requireName(): boolean {
    return this.online;
  }

  public get showSubType(): boolean {
    return this.mapType === MapType.ETERNITIES;
  }

  public get showDeckType(): boolean {
    return this.showSubType
      && this.subType === EternitiesMapSubType.SINGLE_DECK;
  }

  public get showDualDeckConfig(): boolean {
    return this.showSubType
      && this.subType === EternitiesMapSubType.DUAL_DECK;
  }

  public get group(): Group {
    if (
         this.mapType === MapType.ETERNITIES
      && this.deckType === EternitiesMapDeckType.PLANES
    ) {
      return Group.PLANES;
    }

    return Group.ALL;
  }

  public get hasRequiredCards(): boolean {
    if (!this.showAdvanced && this.cards.length === 0) {
      return true;
    }

    switch (this.mapType) {
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
      type: this.mapType,
      online: this.online,
      advanced: {
        name: this.name,
        cards: this.cards.length !== 0 ? this.cards.map(c => c.id) : undefined,
        encounterTriggers: this.encounterConfig,
        specs: {
          subType: this.subType,
          deckType: this.deckType,
        },
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
  width: 250px;
}
</style>
