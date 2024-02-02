import { patterns } from "src/app/shared/utils/validation-patterns";

export class Address {
	street!: string;
	flat!: string;
	locality!: string;
	city!: string;
	province!: string;
	postCode!: string;
	countryCode!: string;

	isValid(): boolean {
		return (
			this.street != '' && this.street != null && patterns.text.test(this.street) && 
			this.city != '' && this.city != null && patterns.city.test(this.city) &&
			this.postCode != '' && this.postCode != null && patterns.postCode.test(this.postCode) &&
			this.countryCode != '' && this.countryCode != null && patterns.countryCode.test(this.countryCode)
		);
	}

	copy(): Address {
        const address: Address = new Address();

        address.street = this.street;
        address.flat = this.flat;
        address.locality = this.locality;
        address.city = this.city;
        address.province = this.province;
        address.postCode = this.postCode;
        address.countryCode = this.countryCode;

        return address;
    }

}


