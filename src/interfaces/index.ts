import type { ITableHeader, ITableItems, ITableOptions } from "./ITable"
import type { IDropdownItem } from "./IDropdown"

type Align = "start" | "center" | "end"

interface IStyles {
  [style: string]: string | number
}

export type {
  ITableHeader,
  ITableItems,
  IDropdownItem,
  Align,
  IStyles,
  ITableOptions,
}
