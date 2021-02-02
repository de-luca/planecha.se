<template>
  <div>
    <div id="nav">
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/nothome">
        NOT Home
      </router-link>
    </div>
    <router-view />
  </div>
</template>
