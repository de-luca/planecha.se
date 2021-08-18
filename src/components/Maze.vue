<template>
  <div class="maze" id="canary" aria-hidden="true" v-html="glyphs"></div>
  <div class="maze" aria-hidden="true" v-html="pattern"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Maze extends Vue {
  private static readonly rows = 10;

  private glyphs: string = '';
  private cols: number = 0;

  public created(): void {
    this.glyphs = Math.random().toString(36).substring(2, 6);
    this.$nextTick(this.computeCols);
    window.addEventListener("resize", this.computeCols);
  }

  public unmounted(): void {
    window.removeEventListener("resize", this.computeCols);
  }

  private computeCols(): void {
    const canaryWidth = (document.getElementById('canary') as HTMLElement).clientWidth;
    const screenWidth = window.innerWidth;

    this.cols = Math.ceil(screenWidth / canaryWidth);
  }

  public get pattern(): string {
    let pattern = '';
    for (let r = 0; r < Maze.rows; r++) {
      for(let c = 0; c < this.cols; c++) {
        pattern += this.glyphs;
      }
      pattern += '<br>';
    }

    return pattern;
  }
}
</script>

<style lang="scss" scoped>
.maze {
  font-family: 'MazeletterUtopia';
  color: #f9f9f9;
  display: block;
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  text-align: left;
  font-size: 10vh;
  line-height: 1em;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
}

#canary {
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
}
</style>
