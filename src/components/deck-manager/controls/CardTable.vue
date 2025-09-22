<template>
  <Table>
    <TableHeader>
      <TableRow class="h-10 grid grid-cols-[3rem_3fr_1fr_1fr_1fr] gap-1 items-center [&_th]:h-auto">
        <TableHead></TableHead>
        <TableHead>Card Name</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Special</TableHead>
        <TableHead class="text-right pr-[2rem]">Sets</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="card in cards"
        :key="card.id"
        class="grid grid-cols-[3rem_3fr_1fr_1fr_1fr] gap-1" 
      >
        <TableCell>
          <HoverCard>
            <HoverCardTrigger as-child>
              <Button class="h-5" variant="ghost" size="icon">
                <Eye />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent align="start" class="p-0 w-100">
              <img class="rounded-[3.5%/4.75%]" loading="lazy" :src="buildImgSrc(card)">
            </HoverCardContent>
          </HoverCard>
        </TableCell>
        <TableCell :class="{ 'line-through text-muted-foreground': !phenomena && card.type === 'Phenomenon' }">
          {{ card.name }}
        </TableCell>
        <TableCell>
          <Badge>{{ card.type }}</Badge>
        </TableCell>
        <TableCell>
          <div class="flex gap-1">
            <Badge v-if="card.isUB" variant="outline">UB</Badge>
            <Badge v-if="card.isPlaytest" variant="destructive">Playtest</Badge>
            <Badge v-if="card.isGold" class="bg-[gold]">Gold</Badge>
          </div>
        </TableCell>
        <TableCell class="pr-[2rem]">
          <div class="flex gap-1 justify-end">
            <TooltipProvider v-for="set in card.sets">
              <Tooltip>
                <TooltipTrigger>
                  <component :is="SETS.get(set)?.icon" class="w-[1.2rem] h-[1.2rem] fill-(--foreground)"/>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{{ SETS.get(set)?.name }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import { Eye } from "lucide-vue-next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Card } from "@/model/card";
import { getSets } from "@/services/setProvider";
import { buildImgSrc } from "@/utils/img";

const { cards, phenomena } = defineProps<{
	cards: Array<Card>;
	phenomena: boolean;
}>();

const SETS = getSets();
</script>
