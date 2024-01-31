import { Fare } from "../components/fare/fare.model"
import { PassList } from "../components/pass-list.model"
import { TerminalMessage } from "../terminal-message.model"

export class BrandedFareMessage extends TerminalMessage{
    key!: string
    carrier!: string
    carrierName!: string
    flightNumber!: string
    origin!: string
    destination!: string
    classOfService!: string
    departureTime!: string
    arrivalTime!: string
    faresList!: Fare[]
    passList!: PassList[]
}

