<template>
  <div class="flex flex-col min-h-[100vh]">

    <div class="relative flex flex-col justify-center items-center h-[15rem]">
      <Maze mode="parent" :dim="{ h: { v: 15, u: 'rem' } }" />
        <router-link title="Back Home" to="/" class="hover:text-muted-foreground hover:cursor-pointer font-[Arial] text-[6rem] z-1">⟁</router-link>
      <h1 class="text-[2rem] z-1">JOIN GAME</h1>
    </div>

    <div class="container flex flex-col items-center gap-3 mt-10">
      <Card class="w-[60rem]">
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

    <!-- <div v-if="loading" class="loading">
      <a class="button is-large is-ghost is-loading"></a>
      <p><b>Looking for game...</b></p>
    </div>

    <template v-else>
      <div v-if="issue && !gameData" class="error">
        <a class="button is-large is-ghost">
          <fa icon="exclamation" fixed-width />
        </a>
        <p><b v-html="issue.msg"></b></p>
        <p v-html="issue.cause"></p>
      </div>

      <form v-else @submit.prevent="join">
        <div class="content">
          <h3>Game type: <b>{{ gameType }}</b></h3>
          <h4>Present players: <b>{{ peerCount }}</b></h4>
        </div>

        <name-input
          class="name-input"
          v-model="name"
          label="Your player name:"
          help="The name people in the game will see you as."
          required
        ></name-input>

        <div v-if="isMulti" class="field">
          <div class="control main">
            <button class="button is-secondary" @click.prevent="toggleDeckBuilder">
              Open deck customization
            </button>
          </div>
          <p class="help is-danger" v-if="!isDeckValid.valid">
            <fa icon="exclamation" fixed-width shake />
            To join you'll need to pick a 10 cards Planar Deck
            ({{ isDeckValid.reqs.map(r => r.text).join(' - ') }})
          </p>
        </div>

        <deck-customization
          v-if="isMulti && openDeckBuilder"
          @cancel="openDeckBuilder = false"
          @use="setDeck"
          :reqs="{ mapType: gameData?.gameType }"
        />

        <div class="field join-game">
          <div class="control">
            <button
              class="button is-primary"
              :class="{ 'is-loading': joining }"
              :disabled="joining || !isDeckValid.valid"
              type="submit"
            >
              Join game
            </button>
          </div>
          <p class="help is-danger" v-if="issue">
            <b v-html="issue.msg"></b><br>
            <span v-html="issue.cause"></span>
          </p>
        </div>
      </form>
    </template> -->
  </div>

  <BrandedFooter class="container" />
</template>

<script setup lang="ts">
import { CircleAlert, LoaderCircle } from "lucide-vue-next";
import { computed, onMounted, ref, toValue } from "vue";
import { useRoute } from "vue-router";
import BrandedFooter from "@/components/controls/BrandedFooter.vue";
import Maze from "@/components/controls/Maze.vue";
import NameInput from "@/components/controls/NameInput.vue";
import DeckManager from "@/components/deck-manager/DeckManager.vue";
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
const username = ref(store.selfName);
const deck = ref<BaseList>();

onMounted(() => {
	console.log(roomId);

	store
		.preJoin(roomId)
		.then((data) => {
			console.log(data);
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
	console.log(deck);
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

// import { Component, Vue } from "vue-facing-decorator";
// import type { Card } from "@/model/card";
// import { GameType } from "@/model/game";
// import { type MainStore, useMain } from "@/store/main";
// // import { type DeckState, getDeckState } from "../deck-manager/utils";

// import BrandedFooter from "@/components/BrandedFooter.vue";
// import NameInput from "@/components/controls/NameInput.vue";
// import DeckCustomization from "@/components/create/DeckManager.vue";
// import {
// 	BlockedError,
// 	OfflineError,
// 	ServerError,
// 	TimeoutError,
// } from "@/model/net";

// type Issue = { msg: string; cause: string };

// @Component({ components: { BrandedFooter, DeckCustomization, NameInput } })
// export default class Join extends Vue {
// 	private store = useMain();

// 	public loading = true;
// 	public name = useMain().selfName ?? "";
// 	public roomId = "";
// 	public joining = false;
// 	public openDeckBuilder = false;
// 	public deck: Array<Card> = [];

// 	public gameData: Awaited<ReturnType<MainStore["preJoin"]>> | null = null;
// 	public issue: Issue | null = null;

// 	public created(): void {
// 		this.roomId = (this.$route.params.roomId as string) ?? "";
// 		this.store
// 			.preJoin(this.roomId)
// 			.then((data) => {
// 				this.gameData = data;
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 				this.store.leave();
// 				this.digestError(err as Error);
// 			})
// 			.finally(() => {
// 				this.loading = false;
// 			});
// 	}

// 	public get gameType(): string {
// 		switch (this.gameData?.gameType) {
// 			case GameType.SINGLE:
// 				return "Single Deck";
// 			case GameType.MULTI:
// 				return "Multiple Decks";
// 			case GameType.ETERNITIES:
// 				return "Eternities Map";
// 		}
// 		return "";
// 	}

// 	public get isMulti(): boolean {
// 		return this.gameData?.gameType === GameType.MULTI;
// 	}

// 	public get isDeckValid(): DeckState {
// 		return !this.isMulti
// 			? { valid: true, reqs: [] }
// 			: getDeckState(this.gameData!.gameType, this.deck);
// 	}

// 	public get peerCount(): number {
// 		return this.store.net?.peerCount ?? 0;
// 	}

// 	public toggleDeckBuilder(): void {
// 		this.openDeckBuilder = !this.openDeckBuilder;
// 	}

// 	public setDeck(deck: Array<Card>): void {
// 		this.openDeckBuilder = false;
// 		this.deck = deck;
// 	}

// 	public async join() {
// 		this.joining = true;
// 		this.store.setName(this.name);
// 		try {
// 			await this.store.join({
// 				type: this.gameData!.gameType,
// 				cards: this.deck.map((c) => c.id),
// 			});
// 		} catch (err) {
// 			console.error(err);
// 			this.store.leave();
// 			this.digestError(err as Error);
// 		}
// 		this.joining = false;
// 	}

// 	private digestError(err: Error): void {
// 		switch (true) {
// 			case err instanceof TimeoutError:
// 				this.issue = {
// 					msg: "The requested room could not be found.",
// 					cause: "The link might be broken or the room as been closed.",
// 				};
// 				break;
// 			case err instanceof OfflineError:
// 				this.issue = {
// 					msg: "No internet connection.",
// 					cause: "Your browser appears to be offline.",
// 				};
// 				break;
// 			case err instanceof BlockedError:
// 				this.issue = {
// 					msg: "No relay could be reached.",
// 					cause: `This might be due to adblocker blocking public webtorrent relays for unknown reason.<br>
//             You can try fixing this issue by deactivating your adblocker.`,
// 				};
// 				break;
// 			case err instanceof ServerError:
// 				this.issue = {
// 					msg: "Signaling server could not be reached.",
// 					cause: "The signaling server might be down.",
// 				};
// 				break;
// 		}
// 	}
// }
</script>

<!-- <style lang="scss" scoped>
.title {
  text-align: center;

 .brand {
    display: inline-block;
    font-size: 6rem;
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

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error {
  text-align: center;
  a.button.is-ghost {
    color: hsl(348, 86%, 61%);
  }
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .status {
    width: 100%;
    text-align: initial;
  }

  .content {
    width: 100%;
    margin-bottom: .5rem;

    h3, h4 {
      color: var(--text-color);
    }
  }
}

.field {
  width: 100%;
  margin-bottom: 1rem;

  input.input {
    width: 100%;
  }

  button {
    width: 100%;
  }

  .control {
    display: flex;
  }
}
</style> -->
