export class UUID {
    private bytes: Uint8Array;

    constructor(bytes?: Uint8Array) {
        if(bytes == null) {
            this.bytes = this.generateUUIDBytes();
            return;
        }
        if (bytes.length !== 16) throw new Error('UUID must be initialized with exactly 16 bytes');

        this.bytes = bytes;
    }

    public toString(): string {
        const hexArray: string[] = Array.from(this.bytes).map((byte: number) => byte.toString(16).padStart(2, '0'));
        return `${hexArray.slice(0, 4).join('')}-${hexArray.slice(4, 6).join('')}-${hexArray.slice(6, 8).join('')}-${hexArray.slice(8, 10).join('')}-${hexArray.slice(10).join('')}`;
    }

    public toBytes(): Uint8Array {
        return this.bytes.slice();
    }

    private generateUUIDBytes(): Uint8Array {
        const cryptoObj = window.crypto || (window as any).msCrypto;

        if (!cryptoObj) return new Uint8Array([...Array(16)].map(() => Math.floor(Math.random() * 256)));
        
        const buffer = new Uint8Array(16);
        cryptoObj.getRandomValues(buffer);
        // Set the version bits (bits 6 and 7) and clear the variant bits (bits 8 and 9)
        buffer[6] = (buffer[6] & 0x0f) | 0x40;
        buffer[8] = (buffer[8] & 0x3f) | 0x80;
        return buffer;

    }

}