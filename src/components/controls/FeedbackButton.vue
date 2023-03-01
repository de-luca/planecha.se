<template>
  <button @click.prevent="click">{{ text }}</button>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-facing-decorator';

export interface Option<T> {
  label?: string;
  value: T;
  help?: string;
}

@Component
export default class FeedbackButton extends Vue {
  @Prop({ required: true })
  public idleText: string;
  @Prop({ required: true })
  public actionText: string;
  @Prop({ required: true })
  public timeout: number;

  public text = '';

  public created(): void {
    this.text = this.idleText;
  }

  public click(): void {
    this.text = this.actionText;
    setTimeout(() => this.text = this.idleText, this.timeout);
  }
}
</script>
