<template>
    <div class="flex flex-col">
        <div>
            <span v-if="phenomena">
                {{ counts.cards }}
            </span>
            <span v-else>
                {{ counts.cards - counts.phenomena }} <s>{{ counts.cards }}</s>
            </span>
            cards
        </div>
        <div class="flex gap-1.5">
            <div>{{ counts.planes }} planes</div>
            <div :class="{ 'line-through': !phenomena }">
                {{ counts.phenomena }} phenomena
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Counts } from "@/types/index";

const { counts, phenomena } = defineProps<{
	counts: Counts;
	phenomena: boolean;
}>();
</script>
