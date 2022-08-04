<template>
  <div>
    <input
      class="input"
      type="text"
      placeholder="New deck name"
      v-model="deckName"
    >
    <feedback-button
      @click.prevent="save"
      :disabled="deckName === ''"
      class="button save"
      idleText="Save Deck"
      actionText="Saved!"
      timeout="1000"
    />
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { Scope } from '../types';
import { Card } from '@/model/card';
import { useConfig } from '@/store/config';

import FeedbackButton from '@/components/FeedbackButton.vue';

class Props {
  public scope = prop<Scope>({ required: true });
  public deck = prop<Array<Card>>({ required: true });
}

@Options({ components: { FeedbackButton } })
export default class SaveDeck extends Vue.with(Props) {
  private store = useConfig();
  private deckName = '';

  public save(): void {
    this.store.addDeck(this.deckName, {
      list: this.deck.map(c => c.id),
      scope: this.scope,
    });
    this.deckName = '';
  }
}
</script>

<style lang="scss" scoped>
.button.save {
  width: 10rem;
}

input {
  border-color: var(--border-color);
}
</style>
