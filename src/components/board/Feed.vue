<template>
  <button
    class="open button is-medium is-outlined"
    title="Toggle game logs"
    @click="toggle"
  >
    <span class="icon is-medium">
      <fa icon="bars" fixed-width />
    </span>
  </button>

  <div class="feed box" :class="{ shown: show, hidden: !show }">
    <template v-for="m in messages.slice().reverse()" :key="m">
      <p v-html="m"></p>
    </template>
  </div>
</template>

<script lang="ts">
import { useMain } from '@/store/main';
import { prop, Vue } from 'vue-class-component';

class Props {
  public defaultShow = prop<boolean>({ required: true });
}

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
@keyframes scale {
  0% {
    transform: scale(0);
    transform-origin: 100% 100%;
    opacity: 1;
  }
  100% {
    transform: scale(1);
    transform-origin: 100% 100%;
    opacity: 1;
  }
}

.open {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 2;

  color: var(--text-color);
  background-color: var(--bg-color);
  border-color: var(--border-color);

  &:hover {
    border-color: #b5b5b5;
  }

  &:focus {
    border-color: #485fc7;;
    box-shadow: 0 0 0 .125em rgba(72,95,199,.25);
  }
}

.feed {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 1;
  height: 50vh;
  width: 22rem;
  border: 1px solid var(--border-color);
  overflow-x: scroll;
  transform: scale(0);
  margin-bottom: 0;

  color: var(--text-color);
  background-color: var(--bg-color);

  &.shown {
	  animation: scale .25s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
  }
}
</style>
