export enum TravellerTypes {
    NONE = ~(~0 << 7),
    ADULTS = 1 << 0,
    CHILDREN = 1 << 1,
    INFANTS = 1 << 2,
    INFANTS_NO_SEAT = 1 << 3,
    SENIORS = 1 << 4,
    MILITARY = 1 << 5,
    GOVERNMENT = 1 << 6,
    ALL = ~(~1 << 7)
}