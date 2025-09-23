<template>
  <div class="flex flex-col min-h-[100vh]">
	<div class="relative flex flex-col justify-center items-center h-[15rem]">
		<Maze mode="parent" :dim="{ h: { v: 15, u: 'rem' } }" />
	  	<router-link title="Back Home" to="/" class="hover:text-muted-foreground hover:cursor-pointer font-[Arial] text-[6rem] z-1 rotate-180">⟁</router-link>
		<h1 class="text-[2rem] z-1">CREATE GAME</h1>
	</div>
	<div class="container flex flex-col items-center gap-3 mt-10">
		<Tabs default-value="single" class="w-[60rem]">
			<TabsList class="grid w-full grid-cols-3 h-10 px-2.5 min-w-10">
				<TabsTrigger class="dark:data-[state=active]:bg-unset" value="single">
					Single Deck
				</TabsTrigger>
				<TabsTrigger class="dark:data-[state=active]:bg-unset" value="multi">
					Multiple Decks
				</TabsTrigger>
				<TabsTrigger class="dark:data-[state=active]:bg-unset" value="eternities">
					Eternities Map
				</TabsTrigger>
			</TabsList>
			<TabsContent value="single">
				<Single />
			</TabsContent>
			<TabsContent value="multi">
				<Multi />
			</TabsContent>
			<TabsContent value="eternities">
				<Eternities />
			</TabsContent>
		</Tabs>
	</div>
  </div>

  <BrandedFooter class="container" />
</template>

<script setup lang="ts">
import BrandedFooter from "@/components/controls/BrandedFooter.vue";
import Maze from "@/components/controls/Maze.vue";
import Eternities from "@/components/create/Eternities.vue";
import Multi from "@/components/create/Multi.vue";
import Single from "@/components/create/Single.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// @Component({
// 	components: {
// 		ButtonPicker,
// 		EncounterSetup,
// 		DeckCustomization,
// 		BrandedFooter,
// 	},
// })
// export default class Create extends Vue {
// 	public readonly gameTypeRequirements: Record<GameType, string> = {
// 		[GameType.SINGLE]: "<b>5 Plane cards</b>.",
// 		[GameType.MULTI]: "<b>10 cards</b>.",
// 		[GameType.ETERNITIES]: "<b>25 Plane cards</b>.",
// 	};

// 	public readonly gameTypeOptions: Array<Option<string>> = [
// 		{
// 			label: "Single Deck",
// 			value: GameType.SINGLE,
// 			help: "Rule 901.15. Single Planar Deck Option.",
// 		},
// 		{
// 			label: "Multiple Decks",
// 			value: GameType.MULTI,
// 			help: "Each player provides their 10 cards Planar Deck.",
// 		},
// 		{
// 			label: "Eternities Map",
// 			value: GameType.ETERNITIES,
// 			help: 'The <a target="_blank" rel="noopener noreferrer" href="https://web.archive.org/web/20221005215028/https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</a> variant of Planechase.',
// 		},
// 	];
// 	public readonly subTypeOptions: Array<Option<string>> = [
// 		{
// 			label: "Single Deck",
// 			value: EternitiesMapSubType.SINGLE_DECK,
// 			help: "Use a single planar deck.",
// 		},
// 		{
// 			label: "Dual Deck",
// 			value: EternitiesMapSubType.DUAL_DECK,
// 			help: "Use two decks, one for Planes, one for Phenomena.",
// 		},
// 	];
// 	public readonly deckTypeOptions: Array<Option<string>> = [
// 		{
// 			label: "Only Planes",
// 			value: EternitiesMapDeckType.PLANES,
// 			help: "Basic Eternities Map with Planes only.",
// 		},
// 		{
// 			label: "Planes and Phenomena",
// 			value: EternitiesMapDeckType.ALL,
// 			help: "Planes and Phenomnena mixed in the same deck. Phenomena are encountered as they're drawn.",
// 		},
// 	];

// 	private store = useMain();

// 	public openDeckBuilder = false;
// 	public creating = false;

// 	public mapType: GameType = GameType.SINGLE;
// 	public subType: EternitiesMapSubType = EternitiesMapSubType.SINGLE_DECK;
// 	public deckType: EternitiesMapDeckType = EternitiesMapDeckType.PLANES;

// 	public encounterConfig: EncounterTriggers = {
// 		[EncounterTrigger.ON_PLANESWALK]: {
// 			enabled: false,
// 			mechanic: EncounterMechanic.MANUAL,
// 			ratio: 6,
// 		},
// 		[EncounterTrigger.ON_HELLRIDE]: {
// 			enabled: true,
// 			mechanic: EncounterMechanic.MANUAL,
// 			ratio: 1,
// 		},
// 	};

// 	public deck: Array<Card> = [];

// 	public get showSubType(): boolean {
// 		return this.mapType === GameType.ETERNITIES;
// 	}

// 	public get showDeckType(): boolean {
// 		return (
// 			this.showSubType && this.subType === EternitiesMapSubType.SINGLE_DECK
// 		);
// 	}

// 	public get showDualDeckConfig(): boolean {
// 		return this.showSubType && this.subType === EternitiesMapSubType.DUAL_DECK;
// 	}

// 	public get canDefaults(): boolean {
// 		return this.mapType !== GameType.MULTI && this.deck.length === 0;
// 	}

// 	public get isDeckValid(): DeckState {
// 		return this.canDefaults
// 			? { valid: true, reqs: [] }
// 			: getDeckState(this.mapType, this.deck);
// 	}

// 	public get deckHelp(): string {
// 		switch (true) {
// 			case this.mapType === GameType.SINGLE:
// 				return "A default deck containing all Planes and Phenomena will be used.";
// 			case this.mapType === GameType.ETERNITIES &&
// 				this.subType === EternitiesMapSubType.SINGLE_DECK &&
// 				this.deckType === EternitiesMapDeckType.PLANES:
// 				return "A default deck containing only Planes will be used.";
// 			case this.mapType === GameType.ETERNITIES &&
// 				this.subType === EternitiesMapSubType.SINGLE_DECK &&
// 				this.deckType === EternitiesMapDeckType.ALL:
// 				return "A default deck containing all Planes and Phenomena will be used.";
// 			case this.mapType === GameType.ETERNITIES &&
// 				this.subType === EternitiesMapSubType.DUAL_DECK:
// 				return "Two decks will be used. One with all Planes, the other with all Phenomena.";
// 			default:
// 				return "";
// 		}
// 	}

// 	public toggleDeckBuilder(): void {
// 		this.openDeckBuilder = !this.openDeckBuilder;
// 	}

// 	public setDeck(deck: Array<Card>): void {
// 		this.openDeckBuilder = false;
// 		this.deck = deck;
// 	}

// 	public async create() {
// 		this.creating = true;

// 		this.store.init({
// 			type: this.mapType,
// 			cards: this.deck.length !== 0 ? this.deck.map((c) => c.id) : undefined,
// 			encounterTriggers: this.encounterConfig,
// 			specs: {
// 				subType: this.subType,
// 				deckType: this.deckType,
// 			},
// 		});

// 		await this.$router.push({ name: "Game" });
// 		this.creating = false;
// 	}
// }
</script>
