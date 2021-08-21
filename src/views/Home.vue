<template>
  <maze />
  <div class="container">
    <div class="cta">
      <h1 class="title">
        <div class="brand">
          <div>⟁</div>
          <div>⟁</div>
          <div>⟁</div>
        </div>
        Mirrod.in
      </h1>
      <div class="btn-grp">
        <router-link class="button is-light" to="/join">
          Join game
        </router-link>
        <router-link class="button is-dark" to="/create">
          Create game
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Maze from '@/components/Maze.vue';

@Options({ components: { Maze } })
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .cta {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .btn-grp {
      display: inline-flex;
      gap: 1rem;

      .button {
        width: 150px;
      }
    }

    .brand {
      text-align: center;

      div {
        position: relative;
        z-index: 1;
        display: inline-block;
        font-size: 2.5rem;
        width: 3rem;
        line-height: 3rem;
        text-align: center;

        &:hover {
          cursor: pointer;
          color: gray;
        }

        &:nth-child(1) {
          transform: rotate(180deg) translateX(-1.5rem);
        }
        &:nth-child(2) {
          z-index: 2;
        }
        &:nth-child(3) {
          transform: rotate(180deg) translateX(1.5rem);
        }
      }
    }
  }
}
</style>
