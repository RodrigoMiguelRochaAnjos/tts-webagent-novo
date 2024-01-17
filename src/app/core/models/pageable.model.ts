import { PageableSort } from "./pageable-sort.model"

export class Pageable {
    sort!: PageableSort;
    pageNumber!: number;
    pageSize!: number;
    offset!: number;
    paged!: boolean;
    unpaged!: boolean;
}