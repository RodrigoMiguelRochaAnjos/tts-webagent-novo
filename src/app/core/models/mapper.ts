
/**
 * {@code Mapper<T, D> } Defines the mandatory logic mappers should have
 * This normalizes code to look identical and reusable
 * 
 */
export interface Mapper<T, D> {
    map(obj: T): D;
    mapArray(obj: T[]): D[];
}