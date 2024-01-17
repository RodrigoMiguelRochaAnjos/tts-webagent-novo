export class Information {
    CountryID!: string;
    CountryName!: string;
    Type!: string;
    Content!: string;
    PublishedDate!: string;
    Source!: string;
    ShowingMore: boolean = false;

    constructor() { }

    static fromServer(serverData: any): Information {
        const info = new Information();
        info.CountryID = serverData.CountryID;
        info.CountryName = serverData.CountryName;
        info.Type = serverData.Type;
        info.Content = serverData.Content;
        info.PublishedDate = serverData.PublishedDate;
        info.Source = serverData.Source;
        return info;
    }
}