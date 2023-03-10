<script setup lang="ts">
import BaseIcon from "@/components/Base/BaseIcon.vue"
import BaseTable from "@/components/Base/BaseTable.vue"
import BaseDialog from "@/components/Base/BaseDialog.vue"
</script>
<template>
  <main class="container">
    <BaseTable
      class="home-table"
      :headers="tableHeaders"
      :items="dictionaryListToTable"
      :search-by="['word', 'translate']"
      :search="search"
      @clickItem="onClickTableItem"
      v-model:options="tableOptions"
    ></BaseTable>
    <BaseDialog class="home-dialog" v-model="showDialog">
      <template #append-icon>
        <BaseIcon
          class="icon-repeat"
          :width="20"
          :height="20"
          icon="repeat"
          @click="showTranslate = !showTranslate"
        ></BaseIcon>
        <BaseIcon
          class="icon-close"
          :width="20"
          :height="20"
          icon="close"
          @click="showDialog = false"
        />
      </template>
      <div class="content">
        <p class="translate-word base-fs-sm base-color-secondary">
          {{ originalSelectedItem?.trans ?? "" }}
        </p>
        <p
          class="original-word base-ff-mina-bold base-fs-xl base-color-secondary"
        >
          {{ originalSelectedItem?.orig ?? "" }}
        </p>
        <img
          class="word-img"
          :src="
            selected_dictionary.img_path
              ? selected_dictionary.img_path + originalSelectedItem?.filename
              : originalSelectedItem?.picurl ?? ''
          "
          :alt="originalSelectedItem?.picau ?? ''"
          width="386"
          height="260"
        />
        <p class="original-ex base-fs-xl base-color-secondary">
          {{
            showTranslate
              ? originalSelectedItem?.trans_ex ?? ""
              : originalSelectedItem?.orig_ex ?? ""
          }}
        </p>
      </div>
    </BaseDialog>
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { mapState, mapActions } from "pinia"
import { useDictionaryStore } from "@/stores/dictionary"
import type { ITableHeader, ITableItems } from "@/interfaces"
import { defaultDocument } from "@vueuse/core"

interface IDictionaryKeys {
  id: number
  orig: string
  trans: string
  transc: string
  picurl?: string
  filename?: string
  picau?: string
  sound: string
  orig_ex: string
  trans_ex: string
}

export default defineComponent({
  data() {
    return {
      showDialog: false,
      tableOptions: {},
      tableHeaders: [
        {
          text: "??????????",
          align: "start",
          value: "id",
          maxWidth: 735,
        },
        { text: "??????????", align: "start", value: "word" },
        { text: "????????????????????????", align: "start", value: "transcription" },
        { text: "??????????????", align: "start", value: "translate" },
      ] as ITableHeader[],
      selectedDictionaryList: [],
      selectedItem: {},
      showTranslate: false,
    }
  },
  computed: {
    ...mapState(useDictionaryStore, {
      dictionary_list: "list",
      selected_dictionary: "selected",
      selected_dictionary_list: "selected_list",
      search: "search",
    }),
    mapDictionaryKeys() {
      switch (this.selected_dictionary.id) {
        case 1: // en-ru
          return {
            id: "id",
            orig: "eng",
            trans: "rus",
            transc: "transc_gb",
            picurl: "picurl",
            picau: "picau",
            filename: "filename",
            sound: "sound_gb",
            orig_ex: "enex",
            trans_ex: "ruex",
          }
        default:
          return {
            id: "id",
            orig: "orig",
            trans: "trans",
            transc: "transc",
            picurl: "picurl",
            picau: "picau",
            filename: "filename",
            sound: "sound",
            orig_ex: "orig_ex",
            trans_ex: "trans_ex",
          }
      }
    },
    dictionaryList(): IDictionaryKeys[] {
      return this.selected_dictionary_list.map((item: any) => {
        return {
          id: item[this.mapDictionaryKeys["id"]],
          orig: item[this.mapDictionaryKeys["orig"]],
          trans: item[this.mapDictionaryKeys["trans"]],
          transc: item[this.mapDictionaryKeys["transc"]],
          picurl: item[this.mapDictionaryKeys["picurl"]] ?? "",
          picau: item[this.mapDictionaryKeys["picau"]] ?? "default",
          filename: item[this.mapDictionaryKeys["filename"]] ?? "default",
          sound: item[this.mapDictionaryKeys["sound"]],
          orig_ex: item[this.mapDictionaryKeys["orig_ex"]],
          trans_ex: item[this.mapDictionaryKeys["trans_ex"]],
        }
      })
    },
    dictionaryListToTable(): ITableItems[] {
      return this.dictionaryList.map((item: IDictionaryKeys) => {
        return {
          id: item.id,
          word: item.orig,
          transcription: item.transc,
          translate: item.trans,
        }
      })
    },
    originalSelectedItem(): IDictionaryKeys {
      return this.dictionaryList.filter((item: IDictionaryKeys) => {
        return item.id == this.selectedItem.id
      })[0]
    },
  },
  watch: {
    selectedItem(newValue) {
      if (newValue) {
        let audio = new Audio()
        audio.src = this.originalSelectedItem.sound
        audio.autoplay = true
      }
    },
  },
  mounted() {
    if (!Object.keys(this.selected_dictionary).length) {
      this.selectDictionary(this.dictionary_list[0])
    }

    this.getDictionaryJson(this.selected_dictionary)

    window.addEventListener("keydown", this.onKeydown)
    window.addEventListener("click", this.onClick)
  },
  unmounted() {
    window.removeEventListener("keydown", this.onKeydown)
    window.removeEventListener("click", this.onClick)
  },
  methods: {
    ...mapActions(useDictionaryStore, [
      "getDictionaryJson",
      "selectDictionary",
    ]),
    onClickTableItem(item: any) {
      this.selectedItem = item
      this.showDialog = !this.showDialog
    },
    onKeydown(event: KeyboardEvent) {
      if (this.showDialog) {
        if (event.key == "ArrowLeft") {
          this.prevWord()
        }

        if (event.key == "ArrowRight") {
          this.nextWord()
        }

        if (event.key == "Escape") {
          this.showDialog = false
        }
      }
    },
    onClick(event: PointerEvent) {
      if (window.screen.width < 525 && this.showDialog) {
        if (event.clientY < window.screen.height / 2) return

        if (event.clientX < window.screen.width / 2) {
          this.prevWord()
        } else {
          this.nextWord()
        }
      }
    },
    prevWord() {
      if (this.selectedItem.id > 1) {
        this.selectItemById(this.selectedItem.id - 1)

        if (
          this.selectedItem.id - 1 <
          this.tableOptions.itemPerPage * (this.tableOptions.page - 1)
        ) {
          this.tableOptions.page--
        }
      }
    },
    nextWord() {
      if (this.selectedItem.id < this.dictionaryList.length) {
        this.selectItemById(this.selectedItem.id + 1)

        if (
          this.selectedItem.id >
          this.tableOptions.itemPerPage * this.tableOptions.page
        ) {
          this.tableOptions.page++
        }
      }
    },
    selectItemById(id: number) {
      this.selectedItem = this.dictionaryList.filter(
        (item: IDictionaryKeys) => {
          return item.id == id
        }
      )[0]
    },
  },
})
</script>
<style lang="scss" scoped>
.container {
  padding-bottom: 130px;
}
.home-table {
  margin-top: 84px;
}
.home-dialog {
  .icon-repeat {
    margin-right: 14px;
  }
  .icon-repeat,
  .icon-close {
    cursor: pointer;
  }
  .content {
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .original-word {
      margin-top: 20px;
    }
    .word-img {
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 12px;
      max-width: 100%;
    }
  }
}
@media screen and (max-width: 735px) {
  .home-table {
    margin-top: 40px;
  }
  .container {
    padding-bottom: 132px;
  }
  .home-dialog {
    .icon-close,
    .icon-repeat {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
