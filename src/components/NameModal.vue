<template>
  <div class="modal" :class="{ active }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="subtitle">Update your Name</p>
        <form @submit.prevent="save">
          <name-input v-model="name" label="Name:" required></name-input>
          <div class="field submit">
            <div class="control">
              <button class="button is-primary" type="submit">
                Save Name
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useMain } from '#/store/main';

import NameInput from '#/components/controls/NameInput.vue';

@Component({
  components: { NameInput },
  emits: ['update:active', 'done'],
})
export default class NameModal extends Vue {
  @Prop({ required: true })
  public active: boolean;

  private store = useMain();
  public name: string = useMain().selfName ?? '';

  public save(): void {
    this.store.setName(this.name);
    this.$emit('update:active', false);
    this.$emit('done');
  }
}
</script>

<style lang="scss" scoped>
.modal.active {
  display: block;
}

.modal-content {
  max-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .5rem;
  margin: 0 auto;

  .subtitle {
    text-align: center;
  }

  .submit {
    text-align: right;
  }

  .box {
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
  }

  & > * {
    width: 100%;
  }
}
</style>
