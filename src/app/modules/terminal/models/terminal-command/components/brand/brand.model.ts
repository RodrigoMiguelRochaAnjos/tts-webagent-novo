import { BaggageAllowance } from "../baggage/baggage-allowance.model"
import { BrandPrice } from "./brand-price.model"
import { CarryAllowance } from "../allowance/carry-allowance.model"

export interface Brand {
    price: BrandPrice
    baggageAllowances: BaggageAllowance[]
    carryAllowances: CarryAllowance[]
}