<template>
  <div class="flex items-center gap-1 py-4">
    <Input 
      class="max-w-sm" 
      placeholder="Filter cards..."
      :model-value="table.getColumn('name')?.getFilterValue() as string"
      @update:model-value="table.getColumn('name')?.setFilterValue($event)"
    />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="border-dashed">
          <CirclePlus class="w-4 h-4" /> Type
          <template v-if="table.getColumn('type')?.getIsFiltered()">
            <Separator orientation="vertical" /> 
            <Badge variant="secondary">
              {{ (table.getColumn('type')?.getFilterValue() as Array<string>).length }} selected
            </Badge>
          </template>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-80">
        <DropdownMenuCheckboxItem
          @select.prevent
          :model-value="isFiltered(table.getColumn('type')!, 'Plane')"
          @update:model-value="toggleFilter(table.getColumn('type')!, 'Plane', $event)"
        >
          Plane
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          @select.prevent
          :model-value="isFiltered(table.getColumn('type')!, 'Phenomenon')"
          @update:model-value="toggleFilter(table.getColumn('type')!, 'Phenomenon', $event)"
        >
          Phenomenon
        </DropdownMenuCheckboxItem>
        <template v-if="table.getColumn('type')?.getIsFiltered()">
          <DropdownMenuSeparator />
          <DropdownMenuItem @select.prevent as-child>
            <Button class="w-full" variant="ghost" @click="table.getColumn('type')?.setFilterValue(null)">
              Clear filters
            </Button>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="border-dashed">
          <CirclePlus class="w-4 h-4" /> Special
          <template v-if="table.getColumn('special')?.getIsFiltered()">
            <Separator orientation="vertical" /> 
            <Badge variant="secondary">
              {{ (table.getColumn('special')?.getFilterValue() as Array<string>).length }} selected
            </Badge>
          </template>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-80">
        <DropdownMenuCheckboxItem
          @select.prevent
          :model-value="isFiltered(table.getColumn('special')!, 'isUB')"
          @update:model-value="toggleFilter(table.getColumn('special')!, 'isUB', $event)"
        >
          Universes Beyond
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          @select.prevent
          :model-value="isFiltered(table.getColumn('special')!, 'isGold')"
          @update:model-value="toggleFilter(table.getColumn('special')!, 'isGold', $event)"
        >
          Gold Border
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          @select.prevent
          :model-value="isFiltered(table.getColumn('special')!, 'isPlaytest')"
          @update:model-value="toggleFilter(table.getColumn('special')!, 'isPlaytest', $event)"
        >
          Playtest
        </DropdownMenuCheckboxItem>
        <template v-if="table.getColumn('special')?.getIsFiltered()">
          <DropdownMenuSeparator />
          <DropdownMenuItem @select.prevent as-child>
            <Button class="w-full" variant="ghost" @click="table.getColumn('special')?.setFilterValue(null)">
              Clear filters
            </Button>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="border-dashed">
          <CirclePlus class="w-4 h-4" /> Set
          <template v-if="table.getColumn('sets')?.getIsFiltered()">
            <Separator orientation="vertical" /> 
            <Badge variant="secondary">
              {{ (table.getColumn('sets')?.getFilterValue() as Array<string>).length }} selected
            </Badge>
          </template>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-80">
        <DropdownMenuCheckboxItem 
          v-for="set in getSets().values()"
          @select.prevent
          :model-value="isFiltered(table.getColumn('sets')!, set.code)"
          @update:model-value="toggleFilter(table.getColumn('sets')!, set.code, $event)"
        >
          <component class="fill-(--foreground)" :is="set.icon" /> {{ set.name }}
        </DropdownMenuCheckboxItem>
        <template v-if="table.getColumn('sets')?.getIsFiltered()">
          <DropdownMenuSeparator />
          <DropdownMenuItem @select.prevent as-child>
            <Button class="w-full" variant="ghost" @click="table.getColumn('sets')?.setFilterValue(null)">
              Clear filters
            </Button>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button
      variant="ghost" 
      v-if="
        table.getColumn('name')?.getIsFiltered() ||
        table.getColumn('type')?.getIsFiltered() ||
        table.getColumn('sets')?.getIsFiltered() ||
        table.getColumn('special')?.getIsFiltered()
      "
      @click="table.resetColumnFilters()"
    >
      Reset <X class="w-4 h-4" />
    </Button>
  </div>

  <div class="rounded-md border relative h-[67vh] overflow-y-auto" ref="tableContainerRef">
    <div :style="{ height: `${totalSize}px` }">
      <Table>
        <TableHeader class="sticky top-0 bg-background z-1 [&_tr]:basis-0 [&_tr]:shadow-[inset_0_1px_0,0_1px_0] [&_tr]:shadow-border [&_tr]:rounded-t-md">
          <TableRow 
            class="w-full grid grid-cols-[3rem_3rem_3fr_1fr_1fr_1fr] gap-1"
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              :style="header.column.columnDef.meta?.style"
              class="p-2"
              v-for="header in headerGroup.headers" :key="header.id"
            >
              <FlexRender
                v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          class="relative w-full"
          :style="{
            height: `${totalSize}px`,
          }"
        >
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              class="absolute w-full grid grid-cols-[3rem_3rem_3fr_1fr_1fr_1fr] gap-1"
              v-for="vRow in virtualRows"
              :key="rows[vRow.index].id"
              :style="{ transform: `translateY(${vRow.start}px)` }"
              :data-index="vRow.index"
              :ref="measureElement"
              :data-state="rows[vRow.index].getIsSelected() ? 'selected' : undefined"
            >
              <template v-for="cell in rows[vRow.index].getVisibleCells()" :key="cell.id">
                <TableCell 
                  v-if="cell.column.id === 'select'"
                  :style="cell.column.columnDef.meta?.style"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
                <TableCell 
                  v-else
                  :style="cell.column.columnDef.meta?.style"
                  @click.prevent="rows[vRow.index].toggleSelected(!rows[vRow.index].getIsSelected())"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </template>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No cards.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>

  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} card(s) selected.<br>
      {{ table.getSelectedRowModel().rows.length }} of 10 cards (min.) in deck.
    </div>

    <Button v-if="saveAction === 'use'" size="sm" :disabled="!isValid" @click="console.log">
      {{ SAVE_ACTIONS[saveAction] }}
    </Button>
    <Form 
      v-else
      v-slot="{ handleSubmit }" 
      as="" 
      :validation-schema="formSchema"
    >
      <Dialog :open="isOpen" @update:open="isOpen = $event">
        <DialogTrigger>
          <Button size="sm" :disabled="!isValid">
            {{ SAVE_ACTIONS[saveAction] }}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Deck</DialogTitle>
            <DialogDescription>
              Give your deck a distintive name.
            </DialogDescription>
          </DialogHeader>
          
          <form 
            class="flex flex-col gap-5"
            id="saveDeckForm" 
            @submit="handleSubmit($event, onSubmit)"
          >
            <FormField v-slot="{ componentField }" name="deckName">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Super Duper Planar Deck" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                  Give a name to your planar deck.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="deckDesc">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="The best bunch of cards." v-bind="componentField" />
                </FormControl>
                <FormDescription>
                  Give a description to your planar deck. (Optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </form>

          <DialogFooter>
            <Button type="submit" form="saveDeckForm">
              {{ SAVE_ACTIONS[saveAction] }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button size="sm">
          <ChevronUp class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56 bg-primary text-primary-foreground" align="end">
        <DropdownMenuRadioGroup v-model="saveAction">
          <DropdownMenuRadioItem v-for="(label, key) in SAVE_ACTIONS" :value="key">
            {{ label }}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type FilterFn,
	FlexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useVueTable,
} from "@tanstack/vue-table";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { toTypedSchema } from "@vee-validate/zod";
import { ChevronUp, CirclePlus, Eye, X } from "lucide-vue-next";
import { computed, h, ref, type VNode } from "vue";
import { toast } from "vue-sonner";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "@/components/ui/table/utils";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Card } from "@/model/card";
import { getAllCards } from "@/services/cardProvider";
import { getSets } from "@/services/setProvider";
import { useDecks } from "@/store";
import { buildImgSrc } from "@/utils/img";
import type { DeckList, Props } from "../utils";

const SETS = getSets();

const SAVE_ACTIONS = {
	save: "Save deck",
	"save&use": "Save and use deck",
	use: "Use deck without saving",
};

const decks = useDecks();
const emit = defineEmits(["use"]);
const { minCards, maxCards, minPlanes, phenomena } = defineProps<Props>();

const saveAction = ref<keyof typeof SAVE_ACTIONS>("save");

const specialFilter: FilterFn<Card> = (
	row,
	_,
	filter: Array<"isUB" | "isGold" | "isPlaytest"> | null | undefined,
) => (!filter || !filter.length ? true : filter.some((f) => row.original[f]));
specialFilter.autoRemove = (
	filter: Array<"isUB" | "isGold" | "isPlaytest"> | null | undefined,
) => !filter?.length;

const columnFilters = ref<ColumnFiltersState>([]);

const columns: Array<ColumnDef<Card>> = [
	{
		id: "select",
		header: ({ table }) =>
			h(
				"div",
				{ class: "h-full flex items-center justify-center" },
				h(Checkbox, {
					modelValue: table.getIsAllPageRowsSelected(),
					"onUpdate:modelValue": (value: boolean) =>
						table.toggleAllPageRowsSelected(!!value),
					ariaLabel: "Select all",
				}),
			),
		cell: ({ row }) =>
			h(
				"div",
				{ class: "h-full flex items-center justify-center" },
				h(Checkbox, {
					modelValue: row.getIsSelected(),
					"onUpdate:modelValue": (value: boolean) =>
						row.toggleSelected(!!value),
					ariaLabel: "Select row",
				}),
			),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: "preview",
		header: () => h("div"),
		cell: ({ row }) =>
			h(HoverCard, () => [
				h(
					HoverCardTrigger,
					{ class: "h-full flex items-center justify-center" },
					() =>
						h(Button, { class: "h-5", variant: "ghost", size: "icon" }, () =>
							h(Eye),
						),
				),
				h(HoverCardContent, { align: "start", class: "p-0 w-100" }, () =>
					h("img", {
						class: "rounded-[3.5%/4.75%]",
						loading: "lazy",
						src: buildImgSrc(row.original),
					}),
				),
			]),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: () => h("div", "Card Name"),
		cell: ({ row }) => h("div", { class: "font-medium" }, row.original.name),
		filterFn: "includesString",
	},
	{
		accessorKey: "type",
		header: () => h("div", "Type"),
		cell: ({ row }) => h(Badge, () => row.original.type),
		filterFn: "arrIncludesSome",
	},
	{
		accessorKey: "special",
		header: () => h("div", "Special"),
		cell: ({ row }) => {
			const badges: Array<VNode> = [];
			row.original.isUB &&
				badges.push(h(Badge, { variant: "outline" }, () => "UB"));
			row.original.isPlaytest &&
				badges.push(h(Badge, { variant: "destructive" }, () => "Playtest"));
			row.original.isGold &&
				badges.push(h(Badge, { class: "bg-[gold]" }, () => "Gold"));
			return h("div", { class: "flex gap-1" }, badges);
		},
		filterFn: specialFilter,
	},
	{
		accessorKey: "sets",
		header: () => h("div", { class: "text-right" }, "Sets"),
		cell: ({ row }) =>
			h(
				"div",
				{ class: "flex gap-1 justify-end" },
				row.original.sets.map((s) => {
					const set = SETS.get(s)!;
					return h(TooltipProvider, () =>
						h(Tooltip, () => [
							h(TooltipTrigger, () =>
								h(set.icon, {
									class: "w-[1.2rem] h-[1.2rem] fill-(--foreground)",
								}),
							),
							h(TooltipContent, { side: "left" }, () => h("p", set.name)),
						]),
					);
				}),
			),
		filterFn: "arrIncludesSome",
		meta: {
			style: {
				"padding-right": "2rem",
			},
		},
	},
];

const table = useVueTable({
	data: getAllCards(),
	columns: columns,
	getCoreRowModel: getCoreRowModel(),
	onColumnFiltersChange: (updaterOrValue) =>
		valueUpdater(updaterOrValue, columnFilters),
	getFilteredRowModel: getFilteredRowModel(),
	state: {
		get columnFilters() {
			return columnFilters.value;
		},
	},
});

const rows = computed(() => table.getRowModel().rows);
const tableContainerRef = ref<HTMLDivElement | null>(null);
const rowVirtualizerOption = computed(() => ({
	count: rows.value.length,
	estimateSize: () => 39,
	getScrollElement: () => tableContainerRef.value,
	overscan: 10,
}));
const rowVirtualizer = useVirtualizer(rowVirtualizerOption);
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());
const totalSize = computed(() => rowVirtualizer.value.getTotalSize());

// biome-ignore lint/suspicious/noExplicitAny: ignore
const measureElement = (el?: any) =>
	el && rowVirtualizer.value.measureElement(el.value);
const isFiltered = (col: Column<Card>, value: string) =>
	new Set((col.getFilterValue() as Array<string> | undefined) ?? []).has(value);
const toggleFilter = (col: Column<Card>, value: string, add: boolean) => {
	const filter = new Set(
		(col.getFilterValue() as Array<string> | undefined) ?? [],
	);
	if (add) {
		filter.add(value);
	} else {
		filter.delete(value);
	}
	col.setFilterValue([...filter]);
};

// biome-ignore lint/suspicious/noExplicitAny: ignore
const buildDesc = (values: any) =>
	h("div", { class: "basis-1 grow" }, [
		h("div", { class: "flex" }, h("strong", values.deckName)),
		h("div", { class: "text-muted-foreground" }, values.deckDesc),
	]);

// biome-ignore lint/suspicious/noExplicitAny: ignore
const toDeckList = (values: any): DeckList => ({
	list: {
		name: values.deckName,
		cards: table.getSelectedRowModel().rows.map((row) => row.original),
		counts: deckCounts.value,
	},
	component: buildDesc(values),
});

const isOpen = ref(false);
const isValid = computed(() => table.getSelectedRowModel().rows.length >= 10);

const deckCounts = computed(() =>
	table.getSelectedRowModel().rows.reduce(
		(acc, row) => {
			acc.cards++;
			row.original.type === "Plane" ? acc.planes++ : acc.phenomena++;
			return acc;
		},
		{
			cards: 0,
			planes: 0,
			phenomena: 0,
		},
	),
);
const formSchema = toTypedSchema(
	z.object({
		deckName: z
			.string()
			.min(1)
			.max(50)
			.refine((val) => !decks.decks.has(val), {
				error: "You already have a deck with that name.",
			}),
		deckDesc: z.string().optional(),
	}),
);

// biome-ignore lint/suspicious/noExplicitAny: ignore
const onSubmit = (values: any) => {
	decks.addDeck(values.deckName, {
		name: values.deckName,
		desc: values.deckDesc,
		cards: table.getSelectedRowModel().rows.map((row) => row.original.id),
		counts: deckCounts.value,
	});

	isOpen.value = false;

	toast("Deck saved");

	if (saveAction.value === "save&use") {
		emit("use", toDeckList(values));
	}
};
</script>
