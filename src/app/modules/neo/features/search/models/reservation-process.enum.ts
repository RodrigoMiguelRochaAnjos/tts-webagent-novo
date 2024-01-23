export enum ReservationProcess {
    SELECT_FLIGHTS = 'SELECT_FLIGHTS',
    FUNDS_CHECKED = 'FUNDS_CHECKED',
    AIR_CHECKOUT_DETAILS = 'AIR_CHECKOUT_DETAILS',
    TRAVELLER_DETAILS_VALID = 'TRAVELLER_DETAILS_VALID',
    AIR_CHECKOUT_PRICE = 'AIR_CHECKOUT_PRICE',
    BOOKING = 'BOOKING'
}

export declare type ReservationProcessesState = {
    [key in ReservationProcess]: Promise<boolean>;
};