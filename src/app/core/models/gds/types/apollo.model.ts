import { GDS } from "../gds.model";

export class Apollo extends GDS {
    
    constructor() {
        super();
    }
    
    public override toString: () => string = (): string  => {
        return "Apollo";
    };
    
    public override save(): Apollo {
        const gds: string = JSON.stringify({
            type: "Apollo",
            data: {
                pcc: this._pcc,
                son: this._son
            }
        });

        localStorage.setItem('gds', gds);

        return this;
    }
    
    public override load(): Apollo {
        const storageItem : string | null = localStorage.getItem("gds");
        
        if(storageItem == null) return this;
        
        JSON.parse(storageItem, (key, value) => {
            if(key === "type" && value != "Apollo") return;

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