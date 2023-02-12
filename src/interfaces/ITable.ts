export interface ITableHeader {
  text: string
  align?: "start" | "center" | "end"
  sortable?: boolean
  value: string
  maxWidth?: number
}

export interface ITableItems {
  [header_key: string]: any
}

export interface ITableOptions {
  page?: number
  pagesCount?: number
  itemPerPage?: number
}
