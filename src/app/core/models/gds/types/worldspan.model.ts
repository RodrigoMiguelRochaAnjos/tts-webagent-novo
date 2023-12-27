import { GDS } from "../gds.model";

export class Worldspan extends GDS {
    
    constructor() {
        super();
    }
    
    public override toString: () => string = (): string  => {
        return "Worldspan";
    };
    
    public override save(): Worldspan {
        const gds: string = JSON.stringify({
            type: "Worldspan",
            data: {
                pcc: this._pcc,
                son: this._son
            }
        });

        localStorage.setItem('gds', gds);

        return this;
    }

    public override load(): Worldspan {
        const storageItem : string | null = localStorage.getItem("gds");
        
        if(storageItem == null) return this;
        
        JSON.parse(storageItem, (key, value) => {
            if(key === "type" && value != "Worldspan") return;

            switch(key) {
                case 'pcc':
                    this._pcc = value;
                    break;
                case 'son':
                    this._son = value;
                    break;
            }
        });

        return this;
    }
    
}