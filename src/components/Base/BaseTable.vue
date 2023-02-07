<template>
  <div class="v-dicti-table">
    <div ref="overlay" class="overlay"></div>
    <table ref="table" class="table-header">
      <thead>
        <tr>
          <td v-for="(header, idx) in headers" :key="idx">{{ header.text }}</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in pageItems"
          :key="idx"
          @click="$emit('click-item', item)"
        >
          <th
            v-for="[key, value] in Object.entries(item)"
            :key="key"
            :style="[
              getHeaderByKey(key).align == 'start' ? 'text-align: start' : '',
            ]"
          >
            {{ value }}
          </th>
        </tr>
      </tbody>
    </table>
    <div class="table-footer">
      <div class="pagination base-ff-roboto-regular base-fs-ssm">
        <div class="pagination__block">
          <p class="per-page">Строк</p>
          <BaseDropdown
            v-model="showItemPerPageDropdown"
            width="60px"
            :items="itemPerPageToDropdownList"
            align="center"
            absolute
            @click-item="onClickItemPerPage"
            @clickOutside="onClickOutside"
          >
            <template #default="{ on, bind }">
              <p class="per-page-count" @click="on.toggle">
                {{ bind.activeItem["value"] }}
              </p>
            </template>
          </BaseDropdown>
          <p class="page">Страница</p>
          <input
            v-model="page"
            min="1"
            :max="pagesCount"
            class="page-count"
            type="number"
          />
          <p class="page-of">из {{ pagesCount }}</p>
        </div>
        <div class="pagination__control">
          <BaseIcon
            class="prev"
            width="32"
            height="32"
            icon="arrowLeft"
            @click="onClickPrev"
          ></BaseIcon>
          <div class="separator"></div>
          <BaseIcon
            class="next"
            width="32"
            height="32"
            icon="arrowRight"
            @click="onClickNext"
          ></BaseIcon>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import BaseDropdown from "./BaseDropdown.vue"
import BaseIcon from "./BaseIcon.vue"
import type { PropType } from "vue"
import type {
  ITableHeader,
  ITableItems,
  IDropdownItem,
  ITableOptions,
} from "@/interfaces"

export default defineComponent({
  emits: ["click-item", "update:options"],
  components: {
    BaseIcon,
    BaseDropdown,
  },
  props: {
    headers: {
      type: Array as PropType<ITableHeader[]>,
      required: true,
    },
    items: {
      type: Array as PropType<ITableItems[]>,
      required: true,
    },
    itemsPerPage: {
      type: Array as PropType<number[]>,
      default: function () {
        return [10, 20, 40, 50, 100]
      },
    },
    searchBy: {
      type: String as PropType<ITableHeader["value"]>,
    },
    search: {
      type: String,
    },
    options: {
      type: Object as PropType<ITableOptions>,
      default: () => {
        return {
          page: null,
          itemPerPage: null,
          pagesCount: null,
        }
      },
    },
  },
  data() {
    return {
      showItemPerPageDropdown: false,
      itemPerPage: this.itemsPerPage[0],
      page: 1,
    }
  },
  watch: {
    page(newValue: number, oldValue: number) {
      if (newValue < 1 || newValue > this.pagesCount) {
        this.page = oldValue
      }

      this.updateOptions()
    },
    itemPerPage() {
      this.updateOptions()
    },
    pagesCount() {
      this.updateOptions()
    },
    "options.page"(newValue: number) {
      this.page = newValue
    },
    filteredItems() {
      this.page = 1
    },
  },
  computed: {
    itemPerPageToDropdownList(): IDropdownItem[] {
      return this.itemsPerPage.map((item: number) => {
        return { key: item, value: item }
      })
    },
    pagesCount() {
      return this.filteredItems.length > this.itemPerPage
        ? Math.ceil(this.filteredItems.length / this.itemPerPage)
        : 1
    },
    filteredItems() {
      let items = this.items

      if (this.searchBy && this.search) {
        items = items.filter((item: any) => {
          return !String(item[this.searchBy]).search(this.search)
        })
      }

      return items
    },
    pageItems() {
      let splitItems: any[] = []

      for (let i = 0; i < this.pagesCount; i++) {
        const offset = this.itemPerPage * i

        splitItems.push(
          this.filteredItems.slice(offset, offset + this.itemPerPage)
        )
      }

      return splitItems[this.page - 1] ?? []
    },
  },
  mounted() {
    this.setOverlayWidth()
    window.addEventListener("resize", this.setOverlayWidth)
    this.updateOptions()
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setOverlayWidth)
  },
  methods: {
    updateOptions() {
      this.$emit("update:options", this.getOptions())
    },
    getOptions() {
      const page = this.page,
        pagesCount = this.pagesCount,
        itemPerPage = this.itemPerPage

      return {
        page,
        pagesCount,
        itemPerPage,
      }
    },
    setOverlayWidth() {
      this.$refs.overlay.style.width = this.$refs.table.clientWidth + "px"
    },
    getHeaderByKey(key: string) {
      return (
        this.headers.filter(
          (header: ITableHeader) => header.value == key
        )?.[0] ?? {}
      )
    },
    onClickOutside() {
      this.showItemPerPageDropdown = false
    },
    onClickItemPerPage(item: IDropdownItem) {
      if (this.itemPerPage !== item.value) {
        this.page = 1
      }
      this.itemPerPage = item.value
      this.showItemPerPageDropdown = false
    },
    onClickPrev() {
      this.page--
    },
    onClickNext() {
      this.page++
    },
  },
})
</script>
<style lang="scss" scoped>
@use "sass:map";
@import "@/assets/sass/colors.scss";
@import "@/assets/sass/fonts.scss";
@import "@/assets/sass/variables.scss";

$table_overlay_offset: 38px;

.v-dicti-table {
  position: relative;
  font-size: map.get($font-sizes, "m");
  z-index: 3;
  .overlay {
    position: absolute;
    top: $table_overlay_offset;
    background: map.get($colors, "primary");
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: 10px;
    @include box-shadow;
  }
  table {
    width: 100%;
    border-collapse: separate;
    overflow-x: auto;
  }
  thead {
    font-family: "Roboto";
    td {
      padding-bottom: 22px;
      padding-left: 37px;
    }
  }
  tbody {
    tr {
      &:not(:last-child) {
        th {
          border-bottom: 1px solid map.get($colors, "secondary-2");
        }
      }
      th {
        padding: 12px 37px 12px 37px;
      }
    }
  }

  .pagination {
    display: flex;
    margin-top: 30px;
    margin-left: 34px;
    .pagination__block {
      display: flex;
      border: 1px solid map.get($colors, "secondary-2");
      border-radius: 4px;
      vertical-align: middle;
      align-items: center;
      padding: 3px 0 3px 0;
      max-width: 267px;
      .per-page {
        margin-left: 15px;
        margin-right: 5px;
      }
      .per-page-count {
        padding: 0 10px 0 10px;
        cursor: pointer;
      }
      .page {
        margin-left: 15px;
      }
      .page-count {
        @include input-transparent;
        width: 34px;
        margin-left: 12px;
        margin-right: 12px;
      }
      .page-of {
        margin-right: 15px;
      }
    }
    .pagination__control {
      display: flex;
      align-items: center;
      margin-left: 10px;
      .separator {
        height: 80%;
        width: 1px;
        background-color: map.get($colors, "secondary-2");
      }
      .prev,
      .next {
        cursor: pointer;
      }
    }
  }
}
</style>
