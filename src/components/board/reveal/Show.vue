<template>
  <div class="over">
    <h1 class="title" v-if="title" v-html="title"></h1>
    <div class="revealed">
      <template v-for="c in revealed.relevant" :key="c.id">
        <div class="card-wrapper">
          <img :src="buildImgSrc(c)">
        </div>
      </template>
    </div>
    <button class="button is-dark is-medium" @click="confirm">
      Okay
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { BaseReveal } from './BaseReveal';
import { Card } from '@/model/card';

@Options({
  emits: ['done'],
})
export default class Show extends Vue.with(BaseReveal) {
  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.png`;
  }

  public confirm(): void {
    const picked = this.config.sendShownTo === 'top' ? this.revealed.relevant : [];
    const left = this.revealed.others + this.config.sendShownTo === 'top' 
      ? [] 
      : this.revealed.relevant;

    this.$emit('done', { picked, left });
  }
}
</script>

<style lang="scss" scoped>
@keyframes scale-center {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}

.over {
  background-color: #ffffffb5;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .5rem;
}

.revealed {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  gap: .5rem;

  height: 50%;
  padding-top: 1rem;
  padding-bottom: 1rem;

  .card-wrapper {
    position: absolute; 
    transform-origin: center 2500px;
    
    &:hover {
      z-index: 2;
    }

    img {
      height: 20rem;

      &:hover {
        animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
      }
    }



    &:first-child { 
      transform: rotate(5deg) translate(10rem, 0);  
    }
    &:last-child { 
      transform: rotate(-5deg) translate(-10rem, 0);
    }
  }

  // .card-wrapper {
  //   z-index: 2;

  //   img {
  //     height: 25rem;
      
  //     &:hover {
  //       animation: scale-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  //     }
  //   }
  // } 
}
</style>
