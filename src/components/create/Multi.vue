<template>
    <Card>
        <CardHeader>
            <CardTitle>Multiple Decks</CardTitle>
            <CardDescription>
                Each player bring their 10 cards Planar Deck.
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-5">
            <Field>
                <FieldLabel>
                    Planar Deck
                </FieldLabel>
                <DeckManager 
                    @use="deck = $event" 
                    :min-cards="10"
                    :max-cards="10"
                    :min-planes="5"
                    :phenomena="true"
                />
                <FieldDescription>
                    Pick the planar deck you want to use.
                </FieldDescription>
            </Field>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { DeckManager } from "@/components/deck-manager";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import { useMain } from "@/store";
import type { BaseList } from "@/types";

const router = useRouter();
const store = useMain();

const creating = ref(false);
const deck = ref<BaseList>();

const create = async () => {
	creating.value = true;
	store.init({
		type: "multi",
		cards: deck.value!.cards.map((c) => c.id),
	});
	await router.push({ name: "Game" });
	creating.value = false;
};
</script>