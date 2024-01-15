import { JourneyType } from "src/app/modules/neo/features/search/utils/journey-type.enum";
import { Journey } from "../journey.model";

export class OneWay extends Journey {
    public override toString= ():JourneyType => {
        return JourneyType.ONE_WAY;
    }
}