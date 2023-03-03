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
import { Component, Prop } from 'vue-facing-decorator';
import { WallConfig } from './types';
import { Imgable } from '#/components/Imgable';
import { Phenomenon } from '#/model/card';

import PlaneswalkBtn from '#/components/controls/PlaneswalkBtn.vue';

@Component({
  emits: [ 'resolve' ],
  components: { PlaneswalkBtn },
})
export default class PhenomenonWall extends Imgable {
  @Prop({ required: true })
  public config: WallConfig;
  @Prop({ required: true })
  public phenomenon: Phenomenon;
  @Prop({ required: false })
  public resolver?: () => void;

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
    border-radius: 3.5% / 4.7%;
    filter:
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
      drop-shadow(0 0 5px #DC143C)
    ;
  }

  .planeswalk-btn {
    height: 8rem;
    width: 8rem;
  }
}
</style>
