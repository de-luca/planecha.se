<template>
  <div :class="{ 'is-active': active, 'is-up': !inGame }" class="dropdown">
    <tip>
      <template #btn>
        <div class="dropdown-trigger">
          <button
            @click="active = !active"
            @keyup.space.prevent
            class="button is-ghost"
            aria-haspopup="true"
            aria-controls="main-menu"
          >
            <fa icon="cogs" fixed-width size="lg" />
          </button>
        </div>
      </template>
      <template #tip>Configuration</template>
    </tip>

    <div id="click-trap" @click="active = false"></div>

    <div class="dropdown-menu is-side" id="main-menu" role="menu">
      <div class="dropdown-content">
        <div class="dropdown-item spaced">
          <span>Theme:</span>
          <theme-selector />
        </div>

        <hr class="dropdown-divider">

        <div class="dropdown-item spaced">
          <span>Your Name:</span>
          <button
            class="button is-secondary is-small name"
            title="Edit your name"
            @click="nameModalActive = true"
          >
            {{ selfName ?? 'Not set' }}
          </button>
        </div>

        <template v-if="inGame">
          <template v-if="isMulti">
            <hr class="dropdown-divider">
            <a class="dropdown-item" @click="layoutModalActive = true">
              Customize Player Layout
            </a>
          </template>
          <hr class="dropdown-divider">
          <a class="dropdown-item" @click="resetModalActive = true">
            Reset Game
          </a>
          <hr class="dropdown-divider">
          <a class="dropdown-item" @click="closeModalActive = true">
            {{ online ? 'Leave' : 'Close' }} Game
          </a>
        </template>
      </div>
    </div>
  </div>

  <layout-modal v-model:active="layoutModalActive" />
  <name-modal v-model:active="nameModalActive" />
  <close-modal v-model:active="closeModalActive" :online="online" @close="close" />
  <reset-modal v-model:active="resetModalActive" @close="reset" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import CloseModal from './modals/CloseModal.vue';
import ResetModal from './modals/ResetModal.vue';
import LayoutModal from './modals/LayoutModal.vue';
import { useMain } from '#/store/main';

import ThemeSelector from '#/components/controls/ThemeSelector.vue';
import NameModal from '#/components/NameModal.vue';

@Component({
  components: {
    ThemeSelector,
    CloseModal, NameModal, ResetModal, LayoutModal,
  },
})
export default class MainMenu extends Vue {
  private store = useMain();

  public active = false;
  public nameModalActive = false;
  public closeModalActive = false;
  public resetModalActive = false;
  public layoutModalActive = false;

  public get isMulti(): boolean {
    return this.store.isMulti;
  }

  public get inGame(): boolean {
    return !!this.store._map;
  }

  public get online(): boolean {
    return !!this.store.net;
  }

  public get selfName(): string | null {
    return this.store.selfName;
  }

  public async close(): Promise<void> {
    await this.$router.push('/');
    this.store.leave();
  }

  public reset(): void {
    this.store.reset();
    this.resetModalActive = false;
  }
}
</script>

<style lang="scss" scoped>
#click-trap {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: 3;
}

.dropdown.is-active #click-trap {
  display: block;
}

button.button.is-secondary.is-small.name {
  border-radius: 4px;
}

.dropdown-menu {
  @media screen and (max-height: 720px) {
    top: -450%;
  }

  min-width: 15rem;
  left: 5rem;
  top: -100%;

  .dropdown-content {
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);

    .dropdown-divider {
      background-color: var(--border-color);
    }

    .dropdown-item {
      color: var(--text-color);

      &.spaced {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;

        span {
          white-space: nowrap;
        }
      }
    }

    a.dropdown-item {
      padding-right: 1rem;
      &:hover {
        background-color: var(--secondary);
      }
    }
  }
}
</style>
