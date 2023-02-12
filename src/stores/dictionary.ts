import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

export interface IStoreDictionaryItem {
  id: number
  orig_name: string
  en_name: string
  path: string
  img_path?: string
}

export const useDictionaryStore = defineStore("dictionary", {
  state: () => {
    return {
      selected: {} as IStoreDictionaryItem,
      list: [
        {
          id: 1,
          orig_name: "английско-русский",
          en_name: "english-russian",
          path: "json/en-ru.json",
          img_path: "./jpg/en-ru/",
        },
      ] as IStoreDictionaryItem[],
      selected_list: [],
      search: "",
    }
  },
  actions: {
    selectDictionary(dictionary: IStoreDictionaryItem) {
      this.selected = dictionary
    },
    async getDictionaryJson(dictionary: IStoreDictionaryItem) {
      const module = await import("@/assets/" + dictionary.path)

      this.selected_list = module.default
    },
    setSearch(search: string) {
      this.search = search
    },
  },
})
