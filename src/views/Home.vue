<template>
  <div class="container">
    <div class="cta">
      <h1 class="title">Mirrod.in</h1>
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
import { Vue } from 'vue-class-component';

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
  }
}
</style>
