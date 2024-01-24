import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewsProvidersResponse } from '../models/news-providers-response.model';
import { NewsProvider } from '../models/news-provider.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { New } from '../models/new.model';

@Injectable({
    providedIn: 'root',
})
export class NewsService {
    private providersUrl = `${environment.endpoints.NEWS}/NewsFeed.json`;

    private newsProviders$: BehaviorSubject<NewsProvider[]> = new BehaviorSubject<NewsProvider[]>([]);
    private news$: BehaviorSubject<New[]> = new BehaviorSubject<New[]>([]);

    constructor(private restService: HttpClient) { }

    public getNews() : Observable<New[]> {
        return this.news$;
    }

    loadProviders(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const date = new Date();
            const datetime = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}`;

            this.restService.get(this.providersUrl, { params: { 'dt': datetime }, responseType: 'text', headers: {
                'Accept': 'text/xml',
                'Access-Control-Allow-Origin': '*'
            }}).subscribe({
                next: (result: any) =>{
                    const newsProviders: NewsProvidersResponse = JSON.parse(result) as NewsProvidersResponse;

                    this.newsProviders$.next(newsProviders.newsProviders);
                },
                error: () => resolve(false),
                complete: () => resolve(true)
            });
        });
    }

    loadNews(): Promise<Array<New>> {
        return new Promise<Array<New>>((resolve) => {
            const news = new Array<New>();
            let requests = 0;

            this.restService.get("https://www.businesstravelnews.com/Rss/TopStories", { responseType: 'text'}).subscribe({
                next: (result: any) => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(result.data, 'text/xml');
                    const items = [].slice.call(xml.getElementsByTagName('item'));
                    items.forEach((item: any) => {
                        const title = item.getElementsByTagName('title')[0].childNodes[0].nodeValue.toString();
                        let text = item.getElementsByTagName('description')[0].childNodes[0].nodeValue.toString().replace();
                        const div = document.createElement('div');
                        div.innerHTML = text;
                        text = div.innerText;
                        const link = item.getElementsByTagName('link')[0].childNodes[0].nodeValue.toString();
                        const date = new Date(item.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue.toString());
                        const newObj = new New(title, text, link, date);
                        news.push(newObj);
                    }
                    );
                },
                complete: () => {
                    requests++;
                    if (requests === this.newsProviders$.value.length) {
                        resolve(news);
                    }

                    this.news$.next(news);
                }
            });


            this.newsProviders$.value.forEach((provider: NewsProvider) => {
                if (!(provider.Forced || provider.active)) {
                    requests++;
                    if (requests === this.newsProviders$.value.length) {
                        resolve(news);
                    }
                    return;
                }

                let httpHeaders: { [key: string]: string } = {
                    'Accept': '*/*',
                };

                
            })
        });
    }
}
