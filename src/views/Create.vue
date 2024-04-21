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
        :options="gameTypeOptions"
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
          <button class="button is-secondary" @click.prevent="openDeckBuilder = true">
            Open deck customization
          </button>
        </div>
        <p class="help is-danger" v-if="!isDeckValid.valid">
          <fa icon="exclamation" fixed-width shake />
          Your deck does not satisfies minimum requirements <em>(In order not to explode)</em>:
          {{ isDeckValid.reqs.map(r => r.text).join(' - ') }}
        </p>
        <p class="help" v-else-if="canDefaults">
          <fa icon="lightbulb" fixed-width />
          {{ deckHelp }}
        </p>
      </div>

      <deck-customization
        v-if="openDeckBuilder"
        @cancel="openDeckBuilder = false"
        @use="setDeck"
        :reqs="{mapType, deckType}"
      />

      <div class="field">
        <div class="control main">
          <button
            class="button is-primary"
            :class="{ 'is-loading': creating }"
            type="submit"
            :disabled="!isDeckValid.valid"
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
import { Component, Vue } from "vue-facing-decorator";
import type { Card } from "#/model/card";
import { GameType } from "#/model/game";
import {
	EncounterMechanic,
	EncounterTrigger,
	type EncounterTriggers,
	EternitiesMapDeckType,
	EternitiesMapSubType,
} from "#/model/game/eternities";
import { useMain } from "#/store/main";

import BrandedFooter from "#/components/BrandedFooter.vue";
import ButtonPicker, {
	type Option,
} from "#/components/controls/ButtonPicker.vue";
import DeckCustomization from "#/components/create/DeckCustomization.vue";
import EncounterSetup from "#/components/create/EncounterSetup.vue";
import { type DeckState, getDeckState } from "#/components/create/utils";

@Component({
	components: {
		ButtonPicker,
		EncounterSetup,
		DeckCustomization,
		BrandedFooter,
	},
})
export default class Create extends Vue {
	public readonly gameTypeRequirements: Record<GameType, string> = {
		[GameType.SINGLE]: "<b>5 Plane cards</b>.",
		[GameType.MULTI]: "<b>10 cards</b>.",
		[GameType.ETERNITIES]: "<b>25 Plane cards</b>.",
	};

	public readonly gameTypeOptions: Array<Option<string>> = [
		{
			label: "Single Deck",
			value: GameType.SINGLE,
			help: "Rule 901.15. Single Planar Deck Option.",
		},
		{
			label: "Multiple Decks",
			value: GameType.MULTI,
			help: "Each player provides their 10 cards Planar Deck.",
		},
		{
			label: "Eternities Map",
			value: GameType.ETERNITIES,
			help: 'The <a target="_blank" rel="noopener noreferrer" href="https://web.archive.org/web/20221005215028/https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
		},
	];
	public readonly subTypeOptions: Array<Option<string>> = [
		{
			label: "Single Deck",
			value: EternitiesMapSubType.SINGLE_DECK,
			help: "Use a single planar deck.",
		},
		{
			label: "Dual Deck",
			value: EternitiesMapSubType.DUAL_DECK,
			help: "Use two decks, one for Planes, one for Phenomena.",
		},
	];
	public readonly deckTypeOptions: Array<Option<string>> = [
		{
			label: "Only Planes",
			value: EternitiesMapDeckType.PLANES,
			help: "Basic Eternities Map with Planes only.",
		},
		{
			label: "Planes and Phenomena",
			value: EternitiesMapDeckType.ALL,
			help: "Planes and Phenomnena mixed in the same deck. Phenomena are encountered as they're drawn.",
		},
	];

	private store = useMain();

	public openDeckBuilder = false;
	public creating = false;

	public mapType: GameType = GameType.SINGLE;
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
		return this.mapType === GameType.ETERNITIES;
	}

	public get showDeckType(): boolean {
		return (
			this.showSubType && this.subType === EternitiesMapSubType.SINGLE_DECK
		);
	}

	public get showDualDeckConfig(): boolean {
		return this.showSubType && this.subType === EternitiesMapSubType.DUAL_DECK;
	}

	public get canDefaults(): boolean {
		return this.mapType !== GameType.MULTI && this.deck.length === 0;
	}

	public get isDeckValid(): DeckState {
		return this.canDefaults
			? { valid: true, reqs: [] }
			: getDeckState(this.mapType, this.deck);
	}

	public get deckHelp(): string {
		switch (true) {
			case this.mapType === GameType.SINGLE:
				return "A default deck containing all Planes and Phenomena will be used.";
			case this.mapType === GameType.ETERNITIES &&
				this.subType === EternitiesMapSubType.SINGLE_DECK &&
				this.deckType === EternitiesMapDeckType.PLANES:
				return "A default deck containing only Planes will be used.";
			case this.mapType === GameType.ETERNITIES &&
				this.subType === EternitiesMapSubType.SINGLE_DECK &&
				this.deckType === EternitiesMapDeckType.ALL:
				return "A default deck containing all Planes and Phenomena will be used.";
			case this.mapType === GameType.ETERNITIES &&
				this.subType === EternitiesMapSubType.DUAL_DECK:
				return "Two decks will be used. One with all Planes, the other with all Phenomena.";
			default:
				return "";
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

		this.store.init({
			type: this.mapType,
			cards: this.deck.length !== 0 ? this.deck.map((c) => c.id) : undefined,
			encounterTriggers: this.encounterConfig,
			specs: {
				subType: this.subType,
				deckType: this.deckType,
			},
		});

		await this.$router.push({ name: "Game" });
		this.creating = false;
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
