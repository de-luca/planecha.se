<template>
  <div
    :class="{ 'is-active': active }"
    class="dropdown"
  >
    <tip>
      <template #btn>
        <div class="dropdown-trigger">
          <button
            @click="active = !active"
            @keyup.space.prevent
            class="button is-ghost"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <fa icon="user-plus" fixed-width size="lg"/>
          </button>
        </div>
      </template>
      <template #tip>Online controls</template>
    </tip>

    <div class="click-trap" @click="active = false"></div>

    <div class="dropdown-menu is-side" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <div v-if="!online" class="dropdown-item">
          <div class="field">
            <label class="label">
              <fa icon="torii-gate" fixed-width />
              Open Game
            </label>
            <div class="field">
              <div class="control is-expanded">
                <button class="button is-secondary is-fullwidth" @click="open">
                  Open Game to Multiplayer
                </button>
              </div>
            </div>
            <p class="help" v-if="!issue">You need to open your game to invite people to join.</p>
            <p class="help is-danger" v-else>
              <b>{{ issue.msg }}</b><br>
              {{ issue.cause }}
            </p>
          </div>
        </div>

        <template v-else>
          <div class="dropdown-item">
            <div class="field">
              <label class="label">
                <fa icon="user-plus" fixed-width />
                Invite players
              </label>
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input class="input" type="text" :value="roomUrl" readonly>
                </div>
                <div class="control">
                  <feedback-button
                    @click="copy"
                    id="copy"
                    class="button"
                    idleText="Copy"
                    actionText="Copied!"
                    timeout="5000"
                  />
                </div>
              </div>
              <p class="help">Give this thing to people!</p>
            </div>
          </div>

          <hr class="dropdown-divider">

          <div class="dropdown-item">
            <p class="label">
              <fa icon="users" fixed-width />
              Current Players
            </p>
            <p>{{ playerName }} (You)</p>
            <p v-for="[id, name] in mates" :key="id">{{ name }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>

  <name-modal v-model:active="nameModalActive" @done="open" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useMain } from "#/store/main";

import NameModal from "#/components/NameModal.vue";
import FeedbackButton from "#/components/controls/FeedbackButton.vue";
import {
	BlockedError,
	OfflineError,
	ServerError,
	TimeoutError,
} from "#/model/net";

enum BtnText {
	IDLE = "Copy",
	SUCCESS = "Copied!",
}

type Issue = { msg: string; cause: string };

@Component({ components: { FeedbackButton, NameModal } })
export default class OnlineControls extends Vue {
	private store = useMain();
	private copyBtnText: BtnText = BtnText.IDLE;

	public issue: Issue | null = null;
	public active = false;
	public nameModalActive = false;

	public get online(): boolean {
		return !!this.store.net;
	}

	public get playerName(): string {
		return this.store.selfName!;
	}

	public get roomUrl(): string {
		return `${window.location.origin}/#/game/${this.store.gameId}`;
	}

	public get mates(): Map<string, string> {
		return this.store.mates;
	}

	public async open(): Promise<void> {
		if (!this.store.selfName) {
			this.nameModalActive = true;
			return;
		}

		try {
			await this.store.open();
			this.$router.replace({
				name: "Join",
				params: { roomId: this.store.gameId },
			});
			this.copy();
		} catch (err) {
			this.digestError(err as Error);
		}
	}

	public async copy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(this.roomUrl);
		} catch (err) {
			console.error(err);
		}
	}

	private digestError(err: Error): void {
		console.log(err);
		const issue: Partial<Issue> = { msg: "The game could not be oppened." };
		switch (true) {
			case err instanceof TimeoutError:
				issue.cause = "The link might be broken or the room as been closed.";
				break;
			case err instanceof OfflineError:
				issue.cause = "Your browser appears to be offline.";
				break;
			case err instanceof BlockedError:
				issue.cause = `This might be due to adblocker blocking public webtorrent relays for unknown reason.<br>
					You can try fixing this issue by deactivating your adblocker.`;
				break;
			case err instanceof ServerError:
				issue.cause = "The signaling server might be down.";
				break;
		}
		this.issue = issue as Issue;
	}
}
</script>

<style lang="scss" scoped>
#copy {
  width: 5rem;
  background-color: transparent;
  color: var(--text-color);
}

.click-trap {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: 3;
}

.dropdown.is-active .click-trap {
  display: block;
}

.dropdown-menu {
  width: 30rem;
  top: -100%;
  left: 5rem;

  .dropdown-content {
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);

    .dropdown-divider {
      background-color: var(--border-color);
    }

    .dropdown-item {
      color: var(--text-color);
    }
  }
}
</style>
