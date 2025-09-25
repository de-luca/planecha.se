<template>
  <div class="flex flex-col min-h-[100vh]">

    <div class="relative flex flex-col justify-center items-center h-[15rem]">
      <Maze mode="parent" :dim="{ h: { v: 15, u: 'rem' } }" />
        <router-link title="Back Home" to="/" class="hover:text-muted-foreground font-[Arial] text-[6rem] z-1">⟁</router-link>
      <h1 class="text-[2rem] z-1">JOIN GAME</h1>
    </div>

    <div class="container flex flex-col items-center gap-3 mt-10">
      <Card class="w-full lg:max-w-[64rem]">
        <CardHeader v-if="loading">
          <CardTitle class="flex flex-col items-center gap-5">
            <LoaderCircle class="w-10 h-10 animate-spin" />
            <div>Looking for game...</div>
          </CardTitle>
        </CardHeader>

        <template v-else>
          <CardHeader v-if="issue && !gameData">
            <CardTitle class="flex flex-col items-center gap-5">
              <CircleAlert color="#7f1d1d" class="w-10 h-10" />
              <div v-html="issue.msg"></div>
            </CardTitle>
            <CardDescription class="flex flex-col items-center" v-html="issue.cause">
            </CardDescription>
          </CardHeader>

          <template v-else>
            <CardHeader>
              <CardTitle>
                Game type: <em>{{ gameType }}</em>
              </CardTitle>
              <CardDescription>
                Player present: <em>{{ peerCount }}</em>
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-5">
              <div class="grid gap-2">
                <Label>Username</Label>
                <NameInput v-model="username" />
                <div class="text-muted-foreground text-sm">
                  This username will only be saved on your computer.
                </div>
              </div>
              <div v-if="isMulti" class="grid gap-2">
                <Label>Planar Deck</Label>
                <DeckManager 
                  @use="deck = $event" 
                  :min-cards="10"
                  :max-cards="10"
                  :min-planes="5"
                  :phenomena="true"
                />
                <div class="text-muted-foreground text-sm">
                  Pick the planar deck you want to use.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                class="w-full" :disabled="!ready"
                @click="join"
              >
                <LoaderCircle v-if="joining" class="w-4 h-4 mr-2 animate-spin" />
                <div v-else>Join Game</div>
              </Button>
            </CardFooter>
          </template>
        </template>
      </Card>
    </div>
  </div>

  <BrandedFooter class="container" />
</template>

<script setup lang="ts">
import { CircleAlert, LoaderCircle } from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref, toValue } from "vue";
import { useRoute } from "vue-router";
import { BrandedFooter, Maze, NameInput } from "@/components/controls";
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
import { Label } from "@/components/ui/label";
import { GameType } from "@/model/game";
import {
	BlockedError,
	OfflineError,
	ServerError,
	TimeoutError,
} from "@/model/net";
import { type MainStore, useMain } from "@/store/main";
import type { BaseList } from "@/types/index";

type Issue = { msg: string; cause: string };

const store = useMain();
const roomId = useRoute().params.roomId as string;

const gameData = ref<Awaited<ReturnType<MainStore["preJoin"]>>>();
const loading = ref(true);
const joining = ref(false);
const issue = ref<Issue>();
const username = ref(store.username);
const deck = ref<BaseList>();
const abortController = ref(new AbortController());

onMounted(() => {
	console.log(roomId);
	new Promise<{ gameType: GameType }>((resolve, reject) => {
		abortController.value.signal.addEventListener("abort", reject);
		store.preJoin(roomId).then(resolve).catch(reject);
	})
		.then((data) => {
			gameData.value = data;
		})
		.catch((err) => {
			console.error(err);
			store.leave();
			digestError(err as Error);
		})
		.finally(() => {
			loading.value = false;
		});
});

onUnmounted(() => {
	if (!store._game) {
		abortController.value.abort();
		store.$reset();
	}
});

const gameType = computed(() => {
	switch (gameData.value?.gameType) {
		case "single":
			return "Single Deck";
		case "multi":
			return "Multiple Decks";
		case "eternities":
			return "Eternities Map";
	}
});

const isMulti = computed(() => gameData.value?.gameType === "multi");
const peerCount = computed(() => store.net?.peerCount ?? 0);
const ready = computed(() =>
	isMulti.value ? !joining.value && !!deck.value : !joining.value,
);

const digestError = (err: Error) => {
	switch (true) {
		case err instanceof TimeoutError:
			issue.value = {
				msg: "The requested room could not be found.",
				cause: "The link might be broken or the room as been closed.",
			};
			break;
		case err instanceof OfflineError:
			issue.value = {
				msg: "No internet connection.",
				cause: "Your browser appears to be offline.",
			};
			break;
		case err instanceof BlockedError:
			issue.value = {
				msg: "No relay could be reached.",
				cause: `This might be due to adblocker blocking public webtorrent relays for unknown reason.<br>
          You can try fixing this issue by deactivating your adblocker.`,
			};
			break;
		case err instanceof ServerError:
			issue.value = {
				msg: "Signaling server could not be reached.",
				cause: "The signaling server might be down.",
			};
			break;
	}
};

const join = async () => {
	joining.value = true;
	store.setName(toValue(username)!);
	try {
		await store.join({
			type: gameData.value!.gameType,
			cards: deck.value?.cards.map((c) => c.id) ?? [],
		});
	} catch (err) {
		console.error(err);
		store.leave();
		digestError(err as Error);
	}
	joining.value = false;
};
</script>
