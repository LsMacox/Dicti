<script setup lang="ts">
import BaseDropdown from "@/components/Base/BaseDropdown.vue"
import BaseField from "@/components/Base/BaseField.vue"
import BaseIcon from "@/components/Base/BaseIcon.vue"
</script>

<template>
  <header class="main-header container">
    <div class="wrapper header-right">
      <img
        alt="Dicti logo"
        class="logo"
        src="@/assets/png/logo.png"
        width="75"
        height="89"
      />
      <BaseDropdown
        v-model="showMenu"
        :items="dictionaryListToDropdown"
        width="206px"
        @click-item="onClickMenuItem"
        @clickOutside="showMenu = false"
      >
        <template #default="{ on }">
          <div @click="on.toggle" class="lang-item">
            <a href="#" class="v-dicti-href">Языки</a>
            <BaseIcon icon="arrowDown" width="34" height="34" />
          </div>
        </template>
      </BaseDropdown>
    </div>
    <BaseField
      placeholder="Поиск по словарю"
      icon="search"
      width="250px"
      heigth="51px"
      :value="search"
      @update:value="onInputSeach"
    />
  </header>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { mapState, mapActions } from "pinia"
import { useDictionaryStore } from "@/stores/dictionary"
import type { IStoreDictionaryItem } from "@/stores/dictionary"
import type { IDropdownItem } from "@/interfaces"
import { debounce } from "@/helpers"

export default defineComponent({
  data() {
    return {
      showMenu: false,
    }
  },
  computed: {
    ...mapState(useDictionaryStore, {
      dictionary_list: "list",
      search: "search",
    }),
    dictionaryListToDropdown(): IDropdownItem[] {
      return this.dictionary_list.map((item: IStoreDictionaryItem) => {
        return {
          key: item.orig_name,
          value: item.id,
        } as IDropdownItem
      })
    },
  },
  methods: {
    ...mapActions(useDictionaryStore, ["selectDictionary", "setSearch"]),
    onClickMenuItem(item: IDropdownItem) {
      const dictionary_item = this.dictionary_list.filter(
        (dict_item: IStoreDictionaryItem) =>
          dict_item.id == (item.value as Extract<IStoreDictionaryItem, "id">)
      )[0] as IStoreDictionaryItem

      this.selectDictionary(dictionary_item)
      this.showMenu = false
    },
    onInputSeach(search: string) {
      debounce(() => {
        this.setSearch(search)
      }, 100)()
    },
  },
})
</script>
<style lang="scss" scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-right {
    display: flex;
    margin-top: 17px;
    .logo {
      margin-right: 45px;
    }
    .lang-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-top: 24px;
    }
  }
}
</style>
