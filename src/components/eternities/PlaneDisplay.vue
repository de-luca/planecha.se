<template>
  <div class="modal tile-display">
    <div class="modal-background" @click="close"></div>

    <div class="modal-content">
      <img :src="imgSrc">
      <planeswalk-btn
        v-if="(Math.abs(tile.coords.x) + Math.abs(tile.coords.y) === 1)"
        class="planeswalk-btn"
        @click="$emit('planeswalk', tile.coords)"
      />
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="close"
    ></button>
  </div>
</template>

<script lang="ts">
import { mixins, Options, prop } from 'vue-class-component';
import { Imgable } from '../Imgable';
import { Tile } from '@/model/map';

import PlaneswalkBtn from '@/components/btn/PlaneswalkBtn.vue';

class Props {
  public tile = prop<Tile>({ required: true });
}

@Options({
  emits: [ 'close', 'planeswalk' ],
  components: { PlaneswalkBtn },
})
export default class PlaneDisplay extends mixins(Imgable).with(Props) {
  public get imgSrc(): string {
    return this.buildImgSrc(this.tile.plane[0]);
  }

  public close(): void {
    this.$emit('close');
  }
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: row;

  .modal-background {
    cursor: pointer;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 800px;

    img {
      border-radius: 3.5% / 4.7%;
    }

    .planeswalk-btn {
      height: 8rem;
      width: 8rem;
    }
  }
}

</style>
