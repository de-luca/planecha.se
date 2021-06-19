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
import { eventBus, EventType } from '@/services/EventBus';
import { Handler } from 'mitt';
import { useStore, Store } from '@/store';

interface Notif {
  id: number;
  text: string;
  className: string;
}

export default class NotifCenter extends Vue {
  private store: Store;
  private index = 0;
  private notifs: Map<number, Notif> = new Map();

  public created(): void {
    this.store = useStore()
    eventBus.on(EventType.BYE, (payload) => {
      const id = this.index++;
      const mateName = this.store.getters.mates.get(payload.mateId);

      this.notifs.set(id, {
        id,
        text: `<b>${mateName}</b> has left the game`,
        className: 'is-warning',
      });

      setTimeout(() => this.notifs.delete(id), 10000);
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
  }
}
</style>
