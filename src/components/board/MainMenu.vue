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

        <a @click="closeModalOpened = true" class="dropdown-item">
          {{ online ? 'Leave' : 'Close' }} Game
        </a>

      </div>
    </div>

  </div>

  <close-modal
    :online="online"
    :style="{ display: (closeModalOpened ? 'block' : 'none' ) }"
    @dismiss="closeModalOpened = false"
    @close="close()"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useMain } from '@/store/main';

import ThemeSelector from '@/components/ThemeSelector.vue';
import CloseModal from '@/components/board/CloseModal.vue';

@Options({
  components: { ThemeSelector, CloseModal },
})
export default class MainMenu extends Vue {
  private store = useMain();
  public active = false;
  public closeModalOpened = false;

  public get online(): boolean {
    return !!this.store.game;
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

.dropdown-menu {
  width: 15rem;

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
