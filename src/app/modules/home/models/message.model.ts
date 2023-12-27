import { Masks } from "./masks.model"

export interface Message {
    text: string
    masks: Masks
}