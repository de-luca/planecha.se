<template>
  <div class="flex flex-col min-h-[100vh]">
	<div class="relative flex flex-col justify-center items-center h-[15rem]">
		<Maze mode="parent" :dim="{ h: { v: 15, u: 'rem' } }" />
	  	<router-link title="Back Home" to="/" class="hover:text-muted-foreground hover:cursor-pointer font-[Arial] text-[6rem] z-1 rotate-180">⟁</router-link>
		<h1 class="text-[2rem] z-1">CREATE GAME</h1>
	</div>
	<div class="container flex flex-col items-center gap-3 mt-10">
		<Tabs default-value="single" class="w-full lg:max-w-[64rem]">
			<TabsList class="grid w-full grid-cols-3 h-10 px-2.5 min-w-10">
				<TabsTrigger class="dark:data-[state=active]:bg-unset" value="single">
					Single Deck
				</TabsTrigger>
				<TabsTrigger class="dark:data-[state=active]:bg-unset" value="multi">
					Multiple Decks
				</TabsTrigger>
				<TabsTrigger class="dark:data-[state=active]:bg-unset" value="eternities">
					Eternities Map
				</TabsTrigger>
			</TabsList>
			<TabsContent value="single">
				<Single />
			</TabsContent>
			<TabsContent value="multi">
				<Multi />
			</TabsContent>
			<TabsContent value="eternities">
				<Eternities />
			</TabsContent>
		</Tabs>
	</div>
  </div>

  <BrandedFooter class="container" />
</template>

<script setup lang="ts">
import { BrandedFooter, Maze } from "@/components/controls";
import { Eternities, Multi, Single } from "@/components/create";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
</script>
