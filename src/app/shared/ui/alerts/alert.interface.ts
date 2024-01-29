import { UUID } from "src/app/core/utils/uuid.type";

export abstract class Alert {
    public alertId?: UUID;
    public content?: any;

}
