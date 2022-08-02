<template>
  <div class="notif-center">
    <template v-for="[id, notif] of notifs" :key="id">
      <div class="notification" :class="notif.className">
        <button @click="dismiss(notif.id)" class="delete"></button>
        <p v-html="notif.text"></p>
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
}

export default class NotifCenter extends Vue {
  private store = useMain();
  private index = 0;
  private notifs: Map<number, Notif> = new Map();

  public created(): void {
    this.store.$onAction(({ name, args, store, after }) => {
      switch(name) {
        case 'hey':
          after(() => {
            const id = this.index++;
            this.notifs.set(
              id,
              {
                id,
                text: `<b>${(args[0] as HeyPayload).name}</b> has joined the game`,
                className: 'is-info',
              },
            );
            setTimeout(() => this.notifs.delete(id), 10000);
          });
          break;
        case 'bye':
          const id = this.index++;
          this.notifs.set(
            id,
            {
                id,
                text: `<b>${store.mates.get((args[0] as ByePayload).id) ?? ''}</b> has left the game`,
                className: 'is-warning',
            },
          );
          setTimeout(() => this.notifs.delete(id), 10000);
          break;
      }
    });
  }

  public dismiss(id: number): void {
    this.notifs.delete(id);
  }
}
</script>

<style lang="scss" scoped>
.notif-center {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  gap: .5rem;

  .notification {
    margin: 0;
    z-index: 2;
  }
}
</style>
