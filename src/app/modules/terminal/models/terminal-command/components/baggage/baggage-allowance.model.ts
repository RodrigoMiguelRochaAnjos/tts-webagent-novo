import { BagDetail } from "./bag-detail.model"

export interface BaggageAllowance {
    origin: string
    destination: string
    carrier: string
    carrierName: string
    passCode: string
    textInfo: string
    summary: string
    moreUrl: string
    bagDetails: BagDetail[]
}