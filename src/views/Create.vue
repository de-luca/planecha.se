<template>
  <div class="wrapper">
    <div class="title">
      <router-link class="brand" title="Back Home" to="/">⟁</router-link>
      <div>
        <h1>CREATE GAME</h1>
      </div>
    </div>

    <form @submit.prevent="create">

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
        </div>
        <p class="help is-danger" v-if="!hasRequiredCards.valid">
          <fa icon="exclamation" fixed-width />
          Your deck does not have the minimum required
          <b>Plane</b> cards: <b>{{ hasRequiredCards.minCards }}</b>.
          <em>(In order not to explode)</em>
        </p>
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
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';
import { MapType } from '#/model/map';
import {
  EncounterMechanic,
  EncounterTrigger,
  EncounterTriggers,
  EternitiesMapDeckType,
  EternitiesMapSubType,
} from '#/model/map/eternities';
import { Card, Plane } from '#/model/card';
import { Scope } from '#/components/create/types';

import ButtonPicker, { Option } from '#/components/controls/ButtonPicker.vue';
import DeckBuilder from '#/components/create/DeckBuilder.vue';
import EncounterSetup from '#/components/create/EncounterSetup.vue';
import BrandedFooter from '#/components/BrandedFooter.vue';

@Component({
  components: {
    ButtonPicker,
    EncounterSetup,
    DeckBuilder,
    BrandedFooter,
  },
})
export default class Create extends Vue {
  public readonly mapTypeOptions: Array<Option<string>> = [{
    label: 'Single Deck',
    value: MapType.SINGLE,
    help: 'Rule 901.15. Single Planar Deck Option.',
  }, {
    label: 'Eternities Map',
    value: MapType.ETERNITIES,
    help: 'The <a target="_blank" rel="noopener noreferrer" href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
  }];
  public readonly subTypeOptions: Array<Option<string>> = [{
    label: 'Single Deck',
    value: EternitiesMapSubType.SINGLE_DECK,
    help: 'Use a single planar deck.',
  }, {
    label: 'Dual Deck',
    value: EternitiesMapSubType.DUAL_DECK,
    help: 'Use two decks, one for Planes, one for Phenomena.',
  }];
  public readonly deckTypeOptions: Array<Option<string>> = [{
    label: 'Only Planes',
    value: EternitiesMapDeckType.PLANES,
    help: 'Basic Eternities Map with Planes only.',
  }, {
    label: 'Planes and Phenomena',
    value: EternitiesMapDeckType.ALL,
    help: 'Planes and Phenomnena mixed in the same deck. Phenomena are encountered as they\'re drawn.',
  }];

  private store = useMain();

  public openDeckBuilder = false;
  public creating = false;

  public mapType: MapType = MapType.SINGLE;
  public subType: EternitiesMapSubType = EternitiesMapSubType.SINGLE_DECK;
  public deckType: EternitiesMapDeckType = EternitiesMapDeckType.PLANES;

  public encounterConfig: EncounterTriggers = {
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

  public deck: Array<Card> = [];

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
      ? 'planes'
      : 'all';
  }

  public get hasRequiredCards(): { valid: boolean, minCards?: number } {
    if (!this.openDeckBuilder && this.deck.length === 0) {
      return { valid: true };
    }

    switch (this.mapType) {
      case MapType.SINGLE:
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

    await this.store.init({
      type: this.mapType,
      cards: this.deck.length !== 0 ? this.deck.map(c => c.id) : undefined,
      encounterTriggers: this.encounterConfig,
      specs: {
        subType: this.subType,
        deckType: this.deckType,
      },
    });

    this.creating = false;

    this.$router.push({ name: 'Game' });
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;

 .brand {
    display: inline-block;
    font-size: 6rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.main.control {
  display: flex;
  gap: 1rem;

  button {
    width: 100%;
  }
}


.field {
  width: inherit;
  &:last-of-type {
    margin-bottom: 1rem;
  }
}
</style>
