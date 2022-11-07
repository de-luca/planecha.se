<template>
  <div
    :class="{ 'is-active': active }"
    class="dropdown is-right"
  >
    <div class="dropdown-trigger">
      <button
        @click="active = !active"
        @keyup.space.prevent
        class="button is-outlined"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <span class="icon is-medium">
          <fa icon="user-plus" fixed-width />
        </span>
      </button>
    </div>

    <div class="click-trap" @click="active = false"></div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
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
          <p>{{ playerName }}</p>
          <template v-for="[id, name] in mates" :key="id">
            <p>{{ name }}</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import FeedbackButton from '../FeedbackButton.vue';
import { useMain } from '@/store/main';

enum BtnText {
  IDLE = 'Copy',
  SUCCESS = 'Copied!',
}

@Options({ components: { FeedbackButton } })
export default class OnlineControls extends Vue {
  private store = useMain();
  private copyBtnText: BtnText = BtnText.IDLE;
  public active = true;

  public get playerName(): string {
    return this.store.playerName;
  }

  public get roomUrl(): string {
    return `${window.location.origin}/#/join/${this.store.gameId}`;
  }

  public get mates(): Map<string, string> {
    return this.store.mates;
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
