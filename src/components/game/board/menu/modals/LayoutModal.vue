<template>
  <div class="modal" :class="{ active }">
    <div class="modal-background" @click="$emit('update:active', false)"></div>
    <div class="modal-content">
      <div class="box wrapper">
        <div class="field layouts">
          <div class="control">
            <input type="radio" id="x2" :value="'x2'" v-model="layout">
            <label class="button is-fullwidth" for="x2">
              <fal fixed-width>
                <fa icon="square" transform="shrink-2 left-8 up-8" />
                <fa icon="square" transform="shrink-2 right-8 up-8" />
                <fa icon="square" transform="shrink-2 left-8 down-8"/>
                <fa icon="arrow-right" transform="shrink-3 right-9 down-8" />
              </fal>
            </label>

            <input type="radio" id="x3" :value="'x3'" v-model="layout">
            <label class="button is-fullwidth" for="x3">
              <fal fixed-width>
                <fa icon="square" transform="shrink-2 left-15 up-8" />
                <fa icon="square" transform="shrink-2 right-15 up-8" />
                <fa icon="square" transform="shrink-2 up-8" />
                <fa icon="square" transform="shrink-2 left-15 down-8" />
                <fa icon="arrow-right" transform="shrink-3 right-1 down-8" />
              </fal>
            </label>
          </div>
        </div>

        <draggable :list="store.playerLayout.players" item-key="index" class="seats" :class="layout">
          <template #item="{ element }">
            <div class="box">{{ store.getMateName(element) }}</div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as draggable from 'vuedraggable';
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

@Component({
  emits: ['update:active'],
  components: { draggable },
})
export default class LayoutModal extends Vue {
  @Prop({ required: true })
  public active: boolean;

  public store = useMain();

  public get layout(): Layout {
    return this.store.playerLayout.layout;
  }
  public set layout(layout: Layout) {
    this.store.setLayout(layout);
  }
}
</script>

<style lang="scss" scoped>
.modal.active {
  display: flex;
}

.modal-content {
  width: 26rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  margin: 0 auto;

  .box {
    text-align: center;
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    margin: 0;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 25rem;

    .layouts {
      &.field {
        width: 100%;
        .control {
          display: flex;
          gap: 1rem;

          label {
            color: var(--picker-color);
            background-color: var(--picker-bg);
            border-color: var(--picker-border);
          }
        }
      }

      input[type="radio"] {
        display: none;

        &:checked+label {
          border-color: var(--picker-checked-border);
        }
      }
    }

    .seats {
      display: grid;
      gap: 1rem;

      &.x2 { grid-template-columns: repeat(2, 1fr) }
      &.x3 { grid-template-columns: repeat(3, 1fr) }

      .box {
        cursor: all-scroll;
        display: flex;
        flex-direction: column;
        justify-content: center;

      }
    }
  }
}
</style>
