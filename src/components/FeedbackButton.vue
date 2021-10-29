<template>
  <button @click.prevent="click">{{ text }}</button>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

export interface Option<T> {
  label?: string;
  value: T;
  help?: string;
}

class Props {
  public idleText = prop<string>({ required: true });
  public actionText = prop<string>({ required: true });
  public timeout = prop<number>({ required: true });
}

export default class FeedbackButton extends Vue.with(Props) {
  private text = this.idleText;

  public click(): void {
    this.text = this.actionText;
    setTimeout(() => this.text = this.idleText, this.timeout);
  }
}
</script>
