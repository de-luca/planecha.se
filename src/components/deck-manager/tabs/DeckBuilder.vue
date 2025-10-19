<template>
  <Dialog :open="deckBuilder.open" @update:open="deckBuilder.open = $event; clean()">
    <DialogContent class="sm:max-w-none w-[95vw] h-[95vh]">
      <DialogHeader>
        <DialogTitle>Deck Builder</DialogTitle>
        <DialogDescription>
          {{ deckBuilder.description }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-center gap-1 py-2">
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

      <div class="rounded-md border relative h-[72vh] overflow-y-auto" ref="tableContainerRef">
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

      <div class="flex items-center justify-end space-x-2 py-2">
        <div class="flex-1 text-sm text-muted-foreground">
          {{ deckCounts.cards }} cards<br>
          <div class="flex h-5 items-center space-x-2 text-sm">
            <div>{{ deckCounts.planes }} planes </div>
            <Separator orientation="vertical" />
            <div>{{ deckCounts.phenomena }} phenomena</div>
          </div>
        </div>

        <TooltipProvider v-if="!isUseable.useable">
          <Tooltip>
            <TooltipTrigger class="text-muted-foreground">
              <TriangleAlert />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                The current card selection is not compatible with the current game type.<br>
                You won't be able to use it as a deck but you can still save it.
              </p>
              <p v-for="issue in isUseable.issues">{{ issue }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ButtonGroup>
          <Button 
            size="sm" 
            :disabled="action.onlyValid && !isUseable.useable"
            @click="onAction"
          >
            {{ action.name }}
          </Button>
          
          <DropdownMenu v-if="Object.keys(deckBuilder.actions).length > 1">
            <DropdownMenuTrigger as-child>
              <Button size="sm">
                <ChevronUp class="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56 bg-primary text-primary-foreground" align="end">
            <DropdownMenuRadioGroup v-model="actionIndex">
              <DropdownMenuRadioItem 
                v-for="(a, i) in deckBuilder.actions" 
                :value="i.toString()" 
                :disabled="a.onlyValid && !isUseable.useable"
              >
                {{ a.name }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

    </DialogContent>
  </Dialog>
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
import { ChevronUp, CirclePlus, Eye, TriangleAlert, X } from "lucide-vue-next";
import { computed, h, ref, toValue, type VNode, watch } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Card } from "@/model/card";
import { getAllCards } from "@/services/cardProvider";
import { getSets } from "@/services/setProvider";
import { useUI } from "@/store";
import { buildImgSrc } from "@/utils/img";
import { isDeckListUseable } from "../utils";

const SETS = getSets();

const { deckBuilder, closeDeckBuilder } = useUI();

const actionIndex = ref<string>("0");
const action = computed(
	() => deckBuilder.actions[parseInt(actionIndex.value, 10)],
);

watch(
	() => deckBuilder.actions,
	() => {
		actionIndex.value = deckBuilder.actions
			.findIndex((a) => a.default)
			.toString();
	},
);

watch(
	() => deckBuilder.cards,
	() =>
		(deckBuilder.cards ?? []).forEach((c) => {
			table.getRow(c).toggleSelected();
		}),
);

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
	getRowId: (row) => row.id,
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

const isUseable = computed(() => {
	return isDeckListUseable(
		{
			cards: table.getSelectedRowModel().rows.map((row) => row.original),
			counts: toValue(deckCounts),
		},
		deckBuilder.specs!,
	);
});

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

const clean = () => {
	closeDeckBuilder();
	table.toggleAllRowsSelected(false);
	table.resetColumnFilters();
};

const onAction = () => {
	action.value.action({
		cards: table.getSelectedRowModel().rows.map((row) => row.original),
		counts: toValue(deckCounts),
	});
	clean();
};
</script>

