<template>
	<Card>
		<CardHeader>
			<CardTitle>Eternities Map</CardTitle>
			<CardDescription>
				The <l target="_blank" rel="noopener noreferrer" href="https://web.archive.org/web/20221005215028/https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">Eternities Map</l> variant of Planechase.
			</CardDescription>
			<p>
			</p>
		</CardHeader>
		<CardContent class="space-y-5">
			<div class="grid gap-2">
				<Label>Deck type</Label>
				<ToggleGroup class="w-full" type="single" variant="outline" size="lg" v-model="deckType">
					<ToggleGroupItem value="single" aria-label="Toggle bold">
						Single Deck
					</ToggleGroupItem>
					<ToggleGroupItem value="dual" aria-label="Toggle italic">
						Dual Deck
					</ToggleGroupItem>
				</ToggleGroup>
				<div class="text-muted-foreground text-sm">
					{{ deckTypeDesc }}
				</div>
			</div>
			<div v-if="deckType === 'single'" class="grid gap-2">
				<Label>Deck composition</Label>
				<ToggleGroup class="w-full" type="single" variant="outline" size="lg" v-model="deckComp">
					<ToggleGroupItem value="planes" aria-label="Toggle bold">
						Only Planes
					</ToggleGroupItem>
					<ToggleGroupItem value="all" aria-label="Toggle italic">
						Planes and Phenomena
					</ToggleGroupItem>
				</ToggleGroup>
				<div class="text-muted-foreground text-sm">
					{{ deckCompDesc }}
				</div>
			</div>

			<div v-else class="grid gap-2">
				<Label>Phenomena encounter</Label>

				<div 
					:class="{'opacity-50': !onHellriding.enabled }"
					class="flex flex-col justify-between gap-2 rounded-lg border p-4" 
				>
					<Label class="text-base">
						<Switch v-model="onHellriding.enabled" />
						On <abbr title="When planeswalking to an empty space">Hellriding</abbr>
					</Label>
					<RadioGroup 
						:disabled="!onHellriding.enabled"
						class="flex flex-row justify-between gap-5" 
						v-model="onHellriding.mode"
					>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="option-one" value="manual" />
							<Label for="option-one">Use your own dices</Label>
						</div>
						<div class="flex items-center space space-x-2">
							<RadioGroupItem id="option-two" value="auto" />
							<Label for="option-two">Automatic encounter</Label>
							<NumberField
								class="w-35"
								id="percent"
								v-model="onHellriding.ratio"
								:step="0.01"
								:min="0"
								:max="1"
								:format-options="{ style: 'percent' }"
							>
								<NumberFieldContent>
									<NumberFieldDecrement :disabled="!onHellriding.enabled && onHellriding.mode !== 'auto'" />
									<NumberFieldInput :disabled="!onHellriding.enabled && onHellriding.mode !== 'auto'" class="h-6" />
									<NumberFieldIncrement :disabled="!onHellriding.enabled && onHellriding.mode !== 'auto'" />
								</NumberFieldContent>
							</NumberField>
						</div>
					</RadioGroup>
					<div class="text-muted-foreground text-sm">
						{{ encounterDesc(onHellriding.mode!) }}
					</div>
				</div>
			
				<div 
					:class="{'opacity-50': !onPlaneswalk.enabled }"
					class="flex flex-col justify-between gap-2 rounded-lg border p-4"
				>
					<Label class="text-base">
						<Switch v-model="onPlaneswalk.enabled" />
						On <abbr title="All planeswalking actions">Planeswalk</abbr>
					</Label>
					<RadioGroup 
						:disabled="!onPlaneswalk.enabled"
						class="flex flex-row justify-between gap-5" 
						v-model="onPlaneswalk.mode"
					>
						<div class="flex items-center space-x-2">
							<RadioGroupItem id="option-one" value="manual" />
							<Label for="option-one">Use your own dices</Label>
						</div>
						<div class="flex items-center space space-x-2">
							<RadioGroupItem id="option-two" value="auto" />
							<Label for="option-two">Automatic encounter</Label>
							<NumberField
								class="w-35"
								id="percent"
								v-model="onPlaneswalk.ratio"
								:step="0.01"
								:min="0"
								:max="1"
								:format-options="{ style: 'percent' }"
							>
								<NumberFieldContent>
									<NumberFieldDecrement :disabled="!onPlaneswalk.enabled && onPlaneswalk.mode !== 'auto'" />
									<NumberFieldInput :disabled="!onPlaneswalk.enabled && onPlaneswalk.mode !== 'auto'" class="h-6" />
									<NumberFieldIncrement :disabled="!onPlaneswalk.enabled && onPlaneswalk.mode !== 'auto'" />
								</NumberFieldContent>
							</NumberField>
						</div>
					</RadioGroup>
					<div class="text-muted-foreground text-sm">
						{{ encounterDesc(onPlaneswalk.mode!) }}
					</div>
				</div>

				<div class="text-muted-foreground text-sm">
					Set how you'll encounter phenomena.
				</div>
			</div>

			<div class="grid gap-2">
				<Label>Planar Deck</Label>
				<DeckManager
					@use="deck = $event" 
					:min-cards="25"
					:min-planes="25"
					:phenomena="usePhenomena"
				/>
				<div class="text-muted-foreground text-sm">
					Pick the planar deck you want to use.
				</div>
			</div>

		</CardContent>
		<CardFooter>
				<Button 
						class="w-full" :disabled="!deck || creating"
						@click="create"
				>
						<LoaderCircle v-if="creating" class="w-4 h-4 mr-2 animate-spin" />
						<div v-else>Start Game</div>
				</Button>
		</CardFooter>
	</Card>
</template>

<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import DeckManager from "@/components/deck-manager/DeckManager.vue";

import type {
	EncounterMode,
	EternitiesMapDeckType,
	EternitiesMapSubType,
	TriggerConfig,
} from "@/model/game/eternities";
import { useMain } from "@/store";
import type { BaseList } from "@/types/index";

const router = useRouter();
const store = useMain();

const creating = ref(false);
const deck = ref<BaseList>();
const deckType = ref<EternitiesMapSubType>("single");
const deckComp = ref<EternitiesMapDeckType>("planes");
const onHellriding = ref<TriggerConfig>({
	enabled: true,
	mode: "manual",
	ratio: 0.1,
});
const onPlaneswalk = ref<TriggerConfig>({
	enabled: false,
	mode: "manual",
	ratio: 0.1,
});

const usePhenomena = computed(
	() => deckType.value === "dual" || deckComp.value === "all",
);

const deckTypeDesc = computed(() =>
	deckType.value === "single"
		? "Use a single planar deck."
		: "Use two decks, one for Planes, one for Phenomena.",
);
const deckCompDesc = computed(() =>
	deckComp.value === "planes"
		? "Basic Eternities Map with Planes only."
		: "Planes and Phenomnena mixed in the same deck. Phenomena are encountered as they're drawn.",
);
const encounterDesc = (mode: EncounterMode) =>
	mode === "manual"
		? "You'll get prompted to roll for the encounter and decide of the outcome."
		: "The encounter will be rolled automaticaly with the probability you defined.";

const create = async () => {
	creating.value = true;
	store.init({
		type: "eternities",
		cards: deck.value!.cards.map((c) => c.id),
		encounterTriggers: {
			onHellride: onHellriding.value,
			onPlaneswalk: onPlaneswalk.value,
		},
		specs: {
			subType: deckType.value,
			deckType: deckComp.value,
		},
	});
	await router.push({ name: "Game" });
	creating.value = false;
};
</script>