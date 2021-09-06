<template>
  <div
    :class="{ 'is-active': active }"
    class="dropdown is-right"
  >
    <div class="dropdown-trigger">
      <button
        @click="active = !active"
        class="button"
        :class="{ 'is-outlined': active, 'is-light': !active }"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <span>Online Controls</span>
      </button>
    </div>

    <div class="dropdown-menu" id="dropdown-menu" role="menu">

      <div class="dropdown-content">

        <div class="dropdown-item">
          <div class="field">
            <label class="label">
              <font-awesome-icon icon="user-plus" fixed-width />
              Invite players
            </label>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input class="input" type="text" :value="roomUrl" readonly>
              </div>
              <div class="control">
                <a @click="copy" id="copy" class="button">{{ copyBtnText }}</a>
              </div>
            </div>
            <p class="help">Give this thing to people!</p>
          </div>
        </div>

        <hr class="dropdown-divider">

        <div class="dropdown-item">
          <p class="label">
            <font-awesome-icon icon="users" fixed-width />
            Current Players
          </p>
          <p>{{ yourName }}</p>
          <template v-for="[id, name] in mates" :key="id">
            <p>{{ name }}</p>
          </template>
        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { Store, useStore } from '@/store';
import { Vue } from 'vue-class-component';

enum BtnText {
  IDLE = 'Copy',
  SUCCESS = 'Copied!',
}

export default class OnlineControls extends Vue {
  private store: Store;
  private active: boolean = true;
  private copyBtnText: BtnText = BtnText.IDLE;

  public created() {
    this.store = useStore();
  }

  public get yourName(): string {
    return this.store.getters.yourName;
  }

  public get roomUrl(): string {
    return `${window.location.origin}/#/join/${this.store.getters.gameId}`;
  }

  public get mates(): Map<string, string> {
    return this.store.getters.mates;
  }

  public async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.roomUrl);
      this.copyBtnText = BtnText.SUCCESS;
      setTimeout(() => this.copyBtnText = BtnText.IDLE, 5000);
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<style lang="scss" scoped>
#copy {
  width: 5rem;
}

.dropdown-trigger {
  height: 100%;

  button {
    height: 100%;
  }
}

.dropdown-menu {
  width: 30rem;
}
</style>
