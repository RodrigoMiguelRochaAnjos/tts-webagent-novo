// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    endpoints: {
        TMA: 'https://tmaws.tts.com/TWS',
        NEO: 'https://airservice.tts.com',
        REFERENCE_DATA: 'https://referencedata.tts.com',
        INFORMATION: 'https://1f63pyjoh1.execute-api.eu-central-1.amazonaws.com/Prod',
        NEWS: 'https://4ceda1bbdf14f97304f2-cc41a62367171a57a9b7400df305a58a.r54.cf3.rackcdn.com',
        CURRENT_ACCOUNT: 'https://currentaccount.tts.com',
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
