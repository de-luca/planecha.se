<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">{{ config.mateName }} encountered a Phenomenon</h1>
      <img :src="imgSrc">
      <planeswalk-btn class="planeswalk-btn" @click="$emit('resolve')" />
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options, prop } from 'vue-class-component';
import { Phenomenon } from '@/model/card';
import { WallProps } from './WallProps';
import { Imgable } from '../Imgable';

import PlaneswalkBtn from '@/components/btn/PlaneswalkBtn.vue';

class Props extends WallProps {
  public phenomenon = prop<Phenomenon>({ required: true });
  public resolver = prop<() => void>({ required: false });
}

@Options({
  emits: [ 'resolve' ],
  components: { PlaneswalkBtn },
})
export default class PhenomenonWall extends mixins(Imgable).with(Props) {
  public get imgSrc(): string {
    return this.buildImgSrc(this.phenomenon);
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  position: absolute;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  img {
    height: 65%;
    filter: drop-shadow(5px 5px 5px red) drop-shadow(-5px -5px 5px red);
    border-radius: 3.5% / 4.7%;
  }

  .planeswalk-btn {
    height: 8rem;
    width: 8rem;
  }
}
</style>
