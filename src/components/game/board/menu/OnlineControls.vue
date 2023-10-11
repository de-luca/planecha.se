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
            <p class="help" v-if="!error">You need to open your game to invite people to join.</p>
            <p class="help is-danger" v-else>
              <b>{{ error.message }}</b><br>
              {{ error.cause }}
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
import { Component, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

import FeedbackButton from '#/components/controls/FeedbackButton.vue';
import NameModal from '#/components/NameModal.vue';

enum BtnText {
  IDLE = 'Copy',
  SUCCESS = 'Copied!',
}

@Component({ components: { FeedbackButton, NameModal } })
export default class OnlineControls extends Vue {
  private store = useMain();
  private copyBtnText: BtnText = BtnText.IDLE;

  public error: Error | null = null;
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
        name: 'Join',
        params: { roomId: this.store.gameId },
      });
      this.copy();
    } catch(err) {
      this.error = new Error(
        'The game could not be oppened.',
        { cause: 'The signaling server or your internet connection might be down.' },
      );
    }
  }

  public async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.roomUrl);
    } catch (err) {
      console.error(err);
    }
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
