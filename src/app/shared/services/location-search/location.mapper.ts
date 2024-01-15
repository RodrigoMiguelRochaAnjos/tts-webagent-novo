import { Injectable } from "@angular/core";
import { SelectedLocation } from "../../models/selected-location.model";
import { LocationSearch, Airport } from "../../models/location-search-response.model";

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
            selectedLocation.text = airport.code + ' (' + locationSearch.name + ', ' + airport.name + ')';
            selectedLocation.airportName = airport.name
        }

        return selectedLocation;
    }

}