<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">You encountered a Phenomenon</h1>
      <img :src="imgSrc">
      <planeswalk-btn class="planeswalk-btn" :disabled="disabled" :resolver="resolver"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { Phenomenon as PhenomenonModel } from '@/model/card';
import PlaneswalkBtn from '@/components/PlaneswalkBtn.vue';

class Props {
  public phenomenon = prop<PhenomenonModel>({ required: true });
  public disabled = prop<boolean>({ required: false, default: false });
  public resolver = prop<() => void>({ required: false });
}

@Options({
  components: { PlaneswalkBtn },
})
export default class Phenomenon extends Vue.with(Props) {
  public get imgSrc(): string {
    return `/cards/${this.phenomenon.id}.png`;
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  img {
    height: 65%;
    filter: drop-shadow(5px 5px 5px red) drop-shadow(-5px -5px 5px red);
  }

  .planeswalk-btn {
    height: 8rem;
    width: 8rem;
  }
}
</style>
