<template>
  <div class="field has-addons">
    <div class="control submit">
      <button class="button" @click.prevent="$emit('done')" :disabled="!state.valid">
        <div v-if="state.valid">{{ options[selected] }}</div>
        <div
          v-else
          v-for="req in state.reqs"
          :class="{ 'has-text-success': req.valid, 'has-text-danger': !req.valid }"
          v-html="req.text"
        ></div>
      </button>
    </div>
    <div class="control">
      <div class="dropdown is-right is-up" :class="{ 'is-active': toggle }">
        <div class="dropdown-trigger">
          <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            :disabled="!state.valid"
            @click.prevent="toggle = !toggle"
          >
            <span class="icon is-small">
              <fa icon="caret-down" fixed-width />
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a
              v-for="(text, id) in options"
              @click.prevent="(selected = id) && (toggle = false)"
              class="dropdown-item"
              :class="{ 'is-active': selected === id }"
            >
              {{ text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { DeckState, ProceedType } from './utils';

export interface ProcessOption {
  id: ProceedType;
  text: string;
}

@Component({ emits: ['update:modelValue', 'done'] })
export default class SaveBtn extends Vue {
  @Prop({ required: true })
  private modelValue: ProceedType;
  @Prop({ required: true })
  public state: DeckState;

  public toggle = false;

  public options: Record<ProceedType, string> = {
    'save_use': 'Save and use Deck',
    'save': 'Save Deck',
    'use': 'Use Deck without saving',
  };

  public get selected(): ProceedType {
    return this.modelValue;
  }

  public set selected(value: ProceedType) {
    this.$emit('update:modelValue', value);
  }

}
</script>

<style lang="scss" scoped>
.submit {
  flex-grow: 1;
  button {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}
</style>
