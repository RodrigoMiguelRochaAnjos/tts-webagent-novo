import { GDS } from "../gds.model";

export class Galileo extends GDS {

    protected override SON_PATTERN = /^[z|Z][a-zA-Z0-9]{2}$/;
    protected override PCC_PATTERN = /^[a-zA-Z0-9]{4}$/;

    constructor() {
        super();
    }

    public override toString: () => string = (): string  => {
        return "Galileo";
    };

    public override save(): Galileo {
        const gds: string = JSON.stringify({
            type: "Galileo",
            data: {
                pcc: this._pcc,
                son: this._son
            }
        });

        localStorage.setItem('gds', gds);

        return this;
    }

    public override load(): Galileo {
        const storageItem : string | null = localStorage.getItem("gds");
        
        if(storageItem == null) return this;
        
        JSON.parse(storageItem, (key, value) => {
            if(key === "type" && value != "Galileo") return;

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