<template>
  <div :class="{ 'is-active': active }" class="dropdown is-right is-up">
    <div class="dropdown-trigger">
      <a
        @click="active = !active"
        @keyup.space.prevent
        class="not-button"
        aria-haspopup="true"
        aria-controls="main-menu"
      >
        <span class="icon is-medium">
          <fa icon="cogs" fixed-width />
        </span>
      </a>
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
      </div>
    </div>
  </div>

  <name-modal v-model:active="nameModalActive" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import NameModal from './NameModal.vue';
import { useMain } from '#/store/main';

import ThemeSelector from '#/components/controls/ThemeSelector.vue';

@Component({ components: { ThemeSelector, NameModal } })
export default class MainMenu extends Vue {
  private store = useMain();
  public active = false;
  public nameModalActive = false;

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

a.not-button {
  color: var(--brand-color-secondary);

  &:hover {
    color: var(--brand-color-primary);
  }
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
