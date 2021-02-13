<template>
  <div class="button">
    {{ name }}<div />
  </div>
</template>

<script lang="ts">
// interface Plane {
//     id: string; // Scryfall UUID
//     name: string;
//     multiverse_ids?: Array<number> | null;
//     oracle_id: string // UUID oracle ID
//     oracle_text: string;
//     scryfall_uri: string;
//     image_uris: ImageCollection;
// }
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Plane',
  props: {
    name: {
      type: String,
      default: 'Plane',
    },
  },
});
</script>
