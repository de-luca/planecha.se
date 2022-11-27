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
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { Scope } from '../types';
import { Card } from '@/model/card';
import { useMain } from '@/store/main';

import FeedbackButton from '@/components/FeedbackButton.vue';

@Component({ components: { FeedbackButton } })
export default class SaveDeck extends Vue {
  @Prop({ required: true })
  public scope: Scope;
  @Prop({ required: true })
  public deck: Array<Card>;

  private store = useMain();
  public deckName = '';

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
