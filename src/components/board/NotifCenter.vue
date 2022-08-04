<template>
  <div class="notif-center">
    <template v-for="[id, notif] of notifs" :key="id">
      <div class="notif-wrapper" @click="dismiss(id)">
        <div class="notification" :class="notif.className">
          <p v-html="notif.text"></p>
        </div>
        <progress
          class="progress is-small"
          :class="notif.className"
          :value="notif.time / 100"
          max="100"
        ></progress>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { ByePayload, HeyPayload, useMain } from '@/store/main';

interface Notif {
  id: number;
  text: string;
  className: string;
  time: number;
  interval?: number;
}

export default class NotifCenter extends Vue {
  private static readonly defaultTime = 10000;
  private static readonly timeStep = 10;

  private store = useMain();
  private index = 0;
  private notifs: Map<number, Notif> = new Map();

  public created(): void {
    this.store.$onAction(({ name, args, store, after }) => {
      switch(name) {
        case 'hey':
          after(() => {
            const notif: Notif = {
              id: this.index++,
              text: `<b>${(args[0] as HeyPayload).name}</b> has joined the game`,
              className: 'is-info',
              time: NotifCenter.defaultTime,
            };
            notif.interval = window.setInterval(() => this.updateTime(notif.id), NotifCenter.timeStep);
            this.notifs.set(notif.id, notif);
          });
          break;
        case 'bye':
          const notif: Notif = {
            id: this.index++,
            text: `<b>${store.mates.get((args[0] as ByePayload).id) ?? ''}</b> has left the game`,
            className: 'is-warning',
            time: NotifCenter.defaultTime,
          };
          notif.interval = window.setInterval(() => this.updateTime(notif.id), NotifCenter.timeStep);
          this.notifs.set(notif.id, notif);
          break;
      }
    });
  }

  public dismiss(id: number): void {
    this.notifs.delete(id);
  }

  private updateTime(id: number): void {
    const notif = this.notifs.get(id) as Notif;

    if (notif.time <= 0) {
      window.clearInterval(notif.interval);
      this.dismiss(id);
      return;
    }

    notif.time = notif.time - NotifCenter.timeStep;
  }
}
</script>

<style lang="scss" scoped>
.notif-center {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  gap: .1rem;

  .notif-wrapper {
    z-index: 2;

    &:hover {
      cursor: pointer;
    }

    .progress {
      border-radius: 0;
      height: .26rem;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: var(--border-color);
    }

    .notification {
      margin: 0;
      padding: .5rem 1rem;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>
