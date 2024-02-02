import { Status } from "../../../models/status.enum";

export class CancelBookingResponse {
    errors?: string[];
    status!: Status;
    warnings?: string[];
}