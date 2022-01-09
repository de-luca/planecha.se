<template>
  <div class="wrapper">
    <div class="logs box" :class="{ shown: show, hidden: !show }">
      <template v-for="m in messages.slice().reverse()" :key="m">
        <p v-html="m"></p>
      </template>
    </div>

    <div class="status-bar" :class="{ shown: show, hidden: !show }">
      <undo-button class="part button" />
      <deck-status class="part" />
      <button
        class="part button"
        title="Toggle game logs"
        @click="toggle"
        @keyup.space.prevent
      >
        <span class="icon is-medium">
          <fa icon="bars" fixed-width />
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { useMain } from '@/store/main';
import { Options, prop, Vue } from 'vue-class-component';
import DeckStatus from './DeckStatus.vue';
import UndoButton from './UndoButton.vue';

class Props {
  public defaultShow = prop<boolean>({ required: true });
}

@Options({
  components: { DeckStatus, UndoButton },
})
export default class Feed extends Vue.with(Props) {
  private store = useMain();
  private show = true;

  public created() {
    this.show = this.defaultShow;
  }

  public get messages(): Array<string> {
    return this.store.feed;
  }

  public toggle(): void {
    this.show = !this.show;
  }
}
</script>

<style lang="scss" scoped>
@keyframes open {
  0% {
    transform: scaleY(0);
    transform-origin: 0% 100%;
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 0% 100%;
    opacity: 1;
  }
}

@keyframes close {
  0% {
    transform: scaleY(1);
    transform-origin: 0% 100%;
    opacity: 1;
  }
  100% {
    transform: scaleY(0);
    transform-origin: 0% 100%;
    opacity: 1;
  }
}

.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.status-bar {
  z-index: 2;
  display: flex;
  flex-direction: row;

  box-shadow:
    0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02)
  ;

  &.hidden .part {
    &:first-child {
      border-top-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
    }
  }

  .part {
    color: var(--text-color);
    background-color: var(--bg-color);
    border-color: var(--border-color);

    border-radius: 0;

    &:first-child {
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-bottom-right-radius: 6px;
    }

    &.button {
      &:hover {
        border-color: #b5b5b5;
      }

      &:focus {
        border-color: #485fc7;;
        box-shadow: 0 0 0 .125em rgba(72,95,199,.25);
      }
    }
  }
}

.logs {
  z-index: 1;
  height: 100%;
  padding: 0;
  margin: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid var(--border-color);
  border-bottom: none;
  overflow-x: scroll;
  transform: scale(0);

  color: var(--text-color);
  background-color: var(--bg-color);

  animation: close .10s ease-in forwards;

  &.shown {
	  animation: open .10s ease-in forwards;
  }

  p {
    padding: .3rem .75rem;

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }
  }
}
</style>
