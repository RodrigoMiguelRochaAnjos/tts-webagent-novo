export abstract class GDS {
    protected SON_PATTERN: RegExp = /(.*)/;
    protected PCC_PATTERN: RegExp = /(.*)/;
    protected _son?: string;
    protected _pcc?: string;
    
    public abstract toString: () => string;

    get son() : string {
        if(typeof this._son === 'undefined') throw new Error("Invalid SON");

        return this._son;
    }

    set son(value: string) {
        const regex = new RegExp(this.SON_PATTERN);

        this._son = value.toUpperCase();
    }

    get pcc(): string {
        if(typeof this._pcc === 'undefined') throw new Error("Invalid PCC");

        return this._pcc;
    }

    set pcc(value: string) {
        const regex = new RegExp(this.PCC_PATTERN);

        if(!regex.test(value)) throw new Error("Invalid PCC");

        this._pcc = value.toUpperCase();
    }

    public abstract save(): GDS;
    public abstract load(): GDS;
    
}