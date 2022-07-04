<template>
  <div class="wrapper">
    <div class="title">
      <router-link class="brand" title="Back Home" to="/">⟁</router-link>
      <div>
        <h1>CREATE GAME</h1>
        <h2 class="subtitle">
          or <router-link to="/join">Join a game</router-link>
        </h2>
      </div>
    </div>

    <form @submit.prevent="create">

      <online-picker v-model="online" />

      <div class="field" v-if="requireName">
        <label class="label">Your player name:</label>
        <div class="control">
          <input v-model="name" id="player-name" class="input" type="text" placeholder="Super Cake" required>
        </div>
        <p class="help">The name people in the game will see you as.</p>
        <label class="checkbox">
          <input type="checkbox" v-model="saveName"> Save name for future online games
        </label>
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
        <div class="control main">
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
      </div>

      <deck-builder
        v-if="openDeckBuilder"
        :base-deck="deck"
        :scope="scope"
        :map-type="mapType"
        @done="setDeck"
      />

      <div class="field">
        <div class="control main">
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

  <branded-footer />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useMain } from '@/store/main';
import { useConfig } from '@/store/config';
import { MapType } from '@/model/map';
import {
  EncounterMechanic,
  EncounterTrigger,
  EncounterTriggers,
  EternitiesMapDeckType,
  EternitiesMapSubType,
} from '@/model/map/eternities';
import { Card, Plane } from '@/model/card';
import { Scope } from '@/components/create/builder/types';
import ButtonPicker, { Option } from '@/components/ButtonPicker.vue';
import DeckBuilder from '@/components/create/DeckBuilder.vue';
import OnlinePicker from '@/components/create/OnlinePicker.vue';
import EncounterSetup from '@/components/create/EncounterSetup.vue';
import BrandedFooter from '@/components/BrandedFooter.vue';

@Options({
  components: {
    ButtonPicker,
    OnlinePicker,
    EncounterSetup,
    DeckBuilder,
    BrandedFooter,
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

  private mainStore = useMain();
  private configStore = useConfig();

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
    this.name = this.configStore.name ?? '';
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

  public get scope(): Scope {
    return (
      this.mapType === MapType.ETERNITIES &&
      this.deckType === EternitiesMapDeckType.PLANES
    )
      ? Scope.PLANES
      : Scope.ALL;
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
      this.configStore.setName(this.name);
    }
    if (this.online && this.name && !this.saveName) {
      this.configStore.removeName();
    }

    await this.mainStore.init({
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
}

.wrapper {
  padding: 1rem;
  margin: 0 auto;
  position: relative;
  width: auto;
  max-width: 800px;
  min-height: 100vh;
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

#player-name {
  width: calc(2 * var(--form-btn-width) + 1rem);
}

.main.control {
  display: flex;
  gap: 1rem;

  button {
    @media screen and (max-width: 480px) {
      & {
        width: 100%;
      }
    }
    width: var(--form-btn-width);
  }
}

.field:last-of-type {
  margin-bottom: 1rem;
}

.deck-custom {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
