export class Address {
	entityName: string;
	street: string;
	flat: string;
	locality: string;
	city: string;
	province: string;
	postCode: string;
	countryCode: string;

	constructor(
		entityName: string,
		street: string,
		flat: string,
		locality: string,
		city: string,
		province: string,
		postCode: string,
		countryCode: string
	) {
		this.entityName = entityName;
		this.street = street;
		this.flat = flat;
		this.locality = locality;
		this.city = city;
		this.province = province;
		this.postCode = postCode;
		this.countryCode = countryCode;
	}
}
