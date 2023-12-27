import { Injectable } from "@angular/core";
import { Airport, LocationSearch } from "../../models/responses/location-search-response.model";
import { SelectedLocation } from "../../models/selected-location.model";

@Injectable({
    providedIn: 'root'
})
export class LocationMapper {

    public static locationSearchToSelectedLocation(locationSearch: LocationSearch, airport?: Airport): SelectedLocation{
        const selectedLocation = new SelectedLocation();
        
        selectedLocation.isCity = true;
        selectedLocation.cityName = locationSearch.name;
        selectedLocation.countryName = locationSearch.country.name;
        selectedLocation.text = locationSearch.code + ' (' + locationSearch.name + ', ' + locationSearch.country.name + ')';
        selectedLocation.code = locationSearch.code;

        if(airport != null) {
            selectedLocation.isCity = false;
            selectedLocation.text = airport.code + ' (' + locationSearch.name + ', ' + locationSearch.country.name + ')';
            selectedLocation.airportName = airport.name
        }

        return selectedLocation;
    }

}