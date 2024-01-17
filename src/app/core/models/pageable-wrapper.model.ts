import { PageableSort } from "./pageable-sort.model";
import { Pageable } from "./pageable.model";

export class PageableWrapper<T> {
    content!: T;
    pageable!: Pageable;
    totalPages!: number;
    totalElements!: number;
    last!: boolean;
    size!: boolean;
    number!: number;
    sort!: PageableSort;
    first!: boolean;
    numberOfElements!: number;
    empty!: boolean;
}