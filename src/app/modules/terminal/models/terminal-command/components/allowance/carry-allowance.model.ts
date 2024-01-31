import { CarryOnDetail } from "./carry-on-detail.model"

export interface CarryAllowance {
    origin: string
    destination: string
    carrier: string
    carrierName: string
    textInfo: string
    carryOnDetails: CarryOnDetail[]
}