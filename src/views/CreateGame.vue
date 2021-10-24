<template>
  <div class="container">
    <div class="title">
      <router-link class="brand" to="/">⟁</router-link>
      <div>
        <h1>CREATE GAME</h1>
        <h2 class="subtitle">
          or <router-link to="/join">Join a game</router-link>
        </h2>
      </div>
      <theme-selector />
    </div>

    <form @submit.prevent="create">

      <online-picker v-model="online" />

      <div class="field" v-if="requireName">
        <label class="label">Your player name:</label>
        <div class="control">
          <input v-model="name" class="input" type="text" placeholder="Super Cake" required>
        </div>
        <label class="checkbox">
          <input type="checkbox" v-model="saveName"> Save name for future online games
        </label>
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
          <button class="button is-secondary" @click.prevent="toggleDeckBuilder">
            Open deck customization
          </button>
          <p class="help is-danger" v-if="!hasRequiredCards.valid">
            <fa icon="exclamation" fixed-width />
            Your deck does not have the minimum required
            <b>Planes</b> cards: <b>{{ hasRequiredCards.minCards }}</b>.<br>
            <em>(In order not to explode)</em>
          </p>
        </div>

      <deck-builder
        v-if="openDeckBuilder"
        :base-deck="deck"
        :group="group"
        :map-type="mapType"
        @done="setDeck"
      />

      <div class="field">
        <div class="control">
          <button
            class="button is-primary"
            :class="{ 'is-loading': creating }"
            type="submit"
            :disabled="!hasRequiredCards.valid"
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
import DeckBuilder, { Group } from '@/components/create/DeckBuilder.vue';
import OnlinePicker from '@/components/create/OnlinePicker.vue';
import EncounterSetup from '@/components/create/EncounterSetup.vue';
import ThemeSelector from '@/components/ThemeSelector.vue';

@Options({
  components: {
    ButtonPicker,
    OnlinePicker,
    EncounterSetup,
    DeckBuilder,
    ThemeSelector,
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

  private store: Store;
  private openDeckBuilder: boolean = false;
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
  private saveName: boolean = false;
  private deck: Array<Card> = [];

  public created() {
    this.store = useStore();

    this.name = localStorage.getItem('name') ?? '';
    this.saveName = this.name !== '';
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
    return (
      this.mapType === MapType.ETERNITIES &&
      this.deckType === EternitiesMapDeckType.PLANES
    )
      ? Group.PLANES
      : Group.ALL;
  }

  public get hasRequiredCards(): { valid: boolean, minCards?: number } {
    if (!this.openDeckBuilder && this.deck.length === 0) {
      return { valid: true };
    }

    switch (this.mapType) {
      case MapType.CLASSIC:
        return {
          valid: this.deck.filter(c => c instanceof Plane).length >= 5,
          minCards: 5,
        };
      case MapType.ETERNITIES:
        return {
          valid: this.deck.filter(c => c instanceof Plane).length >= 25,
          minCards: 25,
        };
      default:
        return { valid: true };
    }
  }

  public toggleDeckBuilder(): void {
    this.openDeckBuilder = !this.openDeckBuilder;
  }

  public setDeck(deck: Array<Card>): void {
    this.openDeckBuilder = false;
    this.deck = deck;
  }

  public async create() {
    this.creating = true;

    if (this.online && this.name && this.saveName) {
      localStorage.setItem('name', this.name);
    }

    if (this.online && this.name && !this.saveName) {
      localStorage.removeItem('name');
    }

    await this.store.dispatch(ActionTypes.INIT, {
      type: this.mapType,
      online: this.online,
      advanced: {
        name: this.name,
        cards: this.deck.length !== 0 ? this.deck.map(c => c.id) : undefined,
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
.title {
  display: flex;

 .brand {
    align-self: center;
    margin-right: 1rem;
    transform: rotate(180deg);
    color: var(--brand-color-primary);

    &:hover {
      color: var(--brand-color-secondary);
    }
  }

  div:first-of-type {
    flex-grow: 1;
  }

  .theme-selector {
    align-self: flex-start;
  }
}

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

.field button {
  width: var(--form-btn-width);
}

.deck-custom {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
