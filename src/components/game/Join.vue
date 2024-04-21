<template>
  <div class="wrapper">
    <div class="title">
      <router-link class="brand" title="Back Home" to="/">⟁</router-link>
      <div>
        <h1>JOIN GAME</h1>
        <h2 class="subtitle">
          or <router-link to="/create">Create a game</router-link>
        </h2>
      </div>
    </div>

    <div v-if="loading" class="loading">
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
          :reqs="{ mapType: gameData?.mapType }"
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
    </template>
  </div>

  <branded-footer />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import type { Card } from "#/model/card";
import { MapType } from "#/model/map";
import { type MainStore, useMain } from "#/store/main";
import { type DeckState, getDeckState } from "../create/utils";

import BrandedFooter from "#/components/BrandedFooter.vue";
import NameInput from "#/components/controls/NameInput.vue";
import DeckCustomization from "#/components/create/DeckCustomization.vue";
import { BlockedError, OfflineError, TimeoutError } from "#/model/net/errors";

type Issue = { msg: string; cause: string };

@Component({ components: { BrandedFooter, DeckCustomization, NameInput } })
export default class Join extends Vue {
	private store = useMain();

	public loading = true;
	public name = useMain().selfName ?? "";
	public roomId = "";
	public joining = false;
	public openDeckBuilder = false;
	public deck: Array<Card> = [];

	public gameData: Awaited<ReturnType<MainStore["preJoin"]>> | null = null;
	public issue: Issue | null = null;

	public created(): void {
		this.roomId = (this.$route.params.roomId as string) ?? "";
		this.store
			.preJoin(this.roomId)
			.then((data) => {
				this.gameData = data;
			})
			.catch((err) => {
				console.error(err);
				this.store.leave();
				this.digestError(err as Error);
			})
			.finally(() => {
				this.loading = false;
			});
	}

	public get gameType(): string {
		switch (this.gameData?.mapType) {
			case MapType.SINGLE:
				return "Single Deck";
			case MapType.MULTI:
				return "Multiple Decks";
			case MapType.ETERNITIES:
				return "Eternities Map";
		}
		return "";
	}

	public get isMulti(): boolean {
		return this.gameData?.mapType === MapType.MULTI;
	}

	public get isDeckValid(): DeckState {
		return !this.isMulti
			? { valid: true, reqs: [] }
			: getDeckState(this.gameData?.mapType, this.deck);
	}

	public get peerCount(): number {
		return this.store.net?.peerCount ?? 0;
	}

	public toggleDeckBuilder(): void {
		this.openDeckBuilder = !this.openDeckBuilder;
	}

	public setDeck(deck: Array<Card>): void {
		this.openDeckBuilder = false;
		this.deck = deck;
	}

	public async join() {
		this.joining = true;
		this.store.setName(this.name);
		try {
			await this.store.join({
				type: this.gameData?.mapType,
				cards: this.deck.map((c) => c.id),
			});
		} catch (err) {
			console.error(err);
			this.store.leave();
			this.digestError(err as Error);
		}
		this.joining = false;
	}

	private digestError(err: Error): void {
		switch (true) {
			case err instanceof TimeoutError:
				this.issue = {
					msg: "The requested room could not be found.",
					cause: "The link might be broken or the room as been closed.",
				};
				break;
			case err instanceof OfflineError:
				this.issue = {
					msg: "No internet connection.",
					cause: "Your browser appear to be offline.",
				};
				break;
			case err instanceof BlockedError:
				this.issue = {
					msg: "No relay could be reached.",
					cause: `This might be due to adblocker blocking public webtorrent relays for unknown reason.<br>
            You can try fixing this issue by deactivating your adblocker.`,
				};
				break;
		}
	}
}
</script>

<style lang="scss" scoped>
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
</style>
