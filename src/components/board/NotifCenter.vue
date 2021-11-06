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
import { eventBus, EventType, NotifEventPayload } from '@/services/EventBus';

interface Notif extends NotifEventPayload {
  id: number;
}

export default class NotifCenter extends Vue {
  private index = 0;
  private notifs: Map<number, Notif> = new Map();

  public created(): void {
    eventBus.on(EventType.NOTIF, (payload) => {
      const id = this.index++;
      this.notifs.set(id, { id, ...payload });
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
    z-index: 2;
  }
}
</style>
