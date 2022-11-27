<template>
  <div :class="{ 'is-active': active }" class="dropdown is-right">
    <div class="dropdown-trigger">
      <button
        @click="active = !active"
        @keyup.space.prevent
        class="button is-outlined"
        aria-haspopup="true"
        aria-controls="main-menu"
      >
        <span class="icon is-medium">
          <fa icon="cogs" fixed-width />
        </span>
      </button>
    </div>

    <div id="click-trap" @click="active = false"></div>

    <div class="dropdown-menu" id="main-menu" role="menu">
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

        <hr class="dropdown-divider">

        <a class="dropdown-item" @click="closeModalActive = true">
          {{ online ? 'Leave' : 'Close' }} Game
        </a>
      </div>
    </div>
  </div>

  <name-modal v-model:active="nameModalActive" />
  <close-modal v-model:active="closeModalActive" :online="online" @close="close" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import CloseModal from './modals/CloseModal.vue';
import NameModal from './modals/NameModal.vue';
import { useMain } from '@/store/main';

import ThemeSelector from '@/components/ThemeSelector.vue';

@Component({ components: { ThemeSelector, CloseModal, NameModal } })
export default class MainMenu extends Vue {
  private store = useMain();
  public active = false;
  public nameModalActive = false;
  public closeModalActive = false;

  public get online(): boolean {
    return !!this.store.game;
  }

  public get selfName(): string | null {
    return this.store.selfName;
  }

  public async close(): Promise<void> {
    await this.$router.push('/');
    this.store.leave();
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
  min-width: 15rem;

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
