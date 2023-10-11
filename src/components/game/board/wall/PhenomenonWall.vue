<template>
  <div class="modal" style="display: flex">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h1 class="title">{{ config.mateName }} encountered a Phenomenon</h1>
      <img :src="imgSrc">
      <button
        class="button is-ghost planeswalk-btn"
        title="Encounter"
        @click="$emit('resolve')"
      >
        <Planeswalk class="icn is-primary" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-facing-decorator';
import { WallConfig } from './types';
import { Imgable } from '#/components/Imgable';
import { Phenomenon } from '#/model/card';

import { Planeswalk } from '#/components/svgs';

@Component({
  emits: [ 'resolve' ],
  components: { Planeswalk },
})
export default class PhenomenonWall extends Imgable {
  @Prop({ required: true })
  public config: WallConfig;
  @Prop({ required: true })
  public phenomenon: Phenomenon;

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
}
</style>
