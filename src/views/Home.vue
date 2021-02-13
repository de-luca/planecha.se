<template>
  <div class="container">
    <div class="cta">
      <h1 class="title">Mirrod.in</h1>
      <div class="btn-grp">
        <router-link class="button" to="/join">
          Join game
        </router-link>
        <router-link class="button" to="/create">
          Create game
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
});
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
