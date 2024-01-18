export const patterns = {
	name: /^[A-zÀ-ú]+(([',. -][A-zÀ-ú ])?[A-zÀ-ú]*)*$/,
	email: /^([a-z0-9._%+-]+@([a-z0-9-]+\.)+[a-z]{2,})$/,
	phone: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
	text: /^(?!\s*$)(.|\n)+$/,
	monthYear: /^[\d]{2}\/[\d]{4}$/,
	ccv: /^[\d]{3}$/,
	city: /^[A-Za-z\s.'-]{1,100}$/,
    passport: /^[A-Z][0-9]{8}$/,
    FFN: /^[A-Za-z0-9-]{4,}$/,
	postCode: /^.{1,20}$/,
	countryCode: /^[A-Za-z]{2}$/
};  