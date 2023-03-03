<template>
  <div class="field">
    <label class="label">Setup Phenomena encounter:</label>

    <div
      class="control box"
      :class="{ active: setup['ON_HELLRIDE'].enabled }"
      @click="setup['ON_HELLRIDE'].enabled = !setup['ON_HELLRIDE'].enabled"
    >
      <label class="checkbox label" @click.stop>
        <input type="checkbox" v-model="setup['ON_HELLRIDE'].enabled">
        On <abbr title="When planeswalking to an empty space">Hellriding</abbr>
      </label>

      <div class="phenomena-trigger">
        <div class="manual">
          <label class="radio" :disabled="!setup['ON_HELLRIDE'].enabled" @click.stop>
            <input
              type="radio"
              name="hellride-trigger"
              value="MANUAL"
              v-model="setup['ON_HELLRIDE'].mechanic"
              :disabled="!setup['ON_HELLRIDE'].enabled"
            >
            Use your own dices
          </label>
        </div>

        <div class="automatic">
          <label class="radio" :disabled="!setup['ON_HELLRIDE'].enabled" @click.stop>
            <input
              type="radio"
              name="hellride-trigger"
              value="AUTO"
              v-model="setup['ON_HELLRIDE'].mechanic"
              :disabled="!setup['ON_HELLRIDE'].enabled"
            >
            Automatic encounter
          </label>
          <div class="field has-addons" @click.stop>
            <p class="control">
              <a class="button is-static is-small">1 chance /</a>
            </p>
            <p class="control">
              <input
                class="input is-small probability"
                type="text"
                v-model="setup['ON_HELLRIDE'].ratio"
                :readonly="!setup['ON_HELLRIDE'].enabled"
              >
            </p>
          </div>
        </div>
      </div>

      <p class="help">{{ helpText[setup['ON_HELLRIDE'].mechanic!] }}</p>
    </div>

    <div
      class="control box"
      :class="{ active: setup['ON_PLANESWALK'].enabled }"
      @click="setup['ON_PLANESWALK'].enabled = !setup['ON_PLANESWALK'].enabled"
    >
      <label class="checkbox label" @click.stop>
        <input type="checkbox" v-model="setup['ON_PLANESWALK'].enabled">
        On <abbr title="All planeswalking actions">Planeswalk</abbr>
      </label>

      <div class="phenomena-trigger">
        <div class="manual">
          <label class="radio" :disabled="!setup['ON_PLANESWALK'].enabled" @click.stop>
            <input
              type="radio"
              name="planeswalk-trigger"
              value="MANUAL"
              v-model="setup['ON_PLANESWALK'].mechanic"
              :disabled="!setup['ON_PLANESWALK'].enabled"
            >
            Use your own dices
          </label>
        </div>

        <div class="automatic">
          <label class="radio" :disabled="!setup['ON_PLANESWALK'].enabled" @click.stop>
            <input
              type="radio"
              name="planeswalk-trigger"
              value="AUTO"
              v-model="setup['ON_PLANESWALK'].mechanic"
              :disabled="!setup['ON_PLANESWALK'].enabled"
            >
            Automatic encounter
          </label>
          <div class="field has-addons" @click.stop>
            <p class="control">
              <a class="button is-static is-small">1 chance /</a>
            </p>
            <p class="control">
              <input
                class="input is-small probability"
                type="text"
                v-model="setup['ON_PLANESWALK'].ratio"
                :readonly="!setup['ON_PLANESWALK'].enabled"
              >
            </p>
          </div>
        </div>
      </div>

      <p class="help">{{ helpText[setup['ON_PLANESWALK'].mechanic!] }}</p>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator';
import { EncounterMechanic, EncounterTriggers } from '#/model/map/eternities';

@Component({ emits: ['update:modelValue'] })
export default class EncounterSetup extends Vue {
  public readonly helpText: Record<EncounterMechanic, string> = {
    [EncounterMechanic.MANUAL]: 'You\'ll get prompted to roll for the encounter and decide of the outcome.',
    [EncounterMechanic.AUTO]: 'The encounter will be rolled automaticaly with the probability you defined.',
  };

  @Prop({ required: true })
  public modelValue: EncounterTriggers;

  public get setup(): EncounterTriggers {
    return this.modelValue;
  }

  public set setup(value: EncounterTriggers) {
    this.$emit('update:modelValue', value);
  }
}
</script>

<style lang="scss" scoped>
.control.box {
  box-shadow: unset;
  color: var(--text-color);
  border: 1px solid var(--picker-border);
  background-color: var(--picker-bg);

  .radio {
    color: var(--text-color);
  }

  > *:hover {
    cursor: initial;
  }
  &:hover {
    cursor: pointer;
  }

  &.active {
    border-color: var(--picker-checked-border);
  }
}

.phenomena-trigger {
  display: flex;
  flex-direction: row;
  align-items: center;

  label.checkbox {
    line-height: unset;
  }

  .manual {
    flex-grow: 1;
  }

  .automatic {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;

    .field {
      display: inline-flex;
    }
    .probability {
      width: 40px;
      text-align: right;
    }
  }
}
</style>
