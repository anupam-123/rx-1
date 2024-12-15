import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://imdb-com.p.rapidapi.com/';
  private apiKey = '6ad3c388bfmsh54a46e4afe7f8aap19643ajsn4c60b9136e8f';

  constructor(private http: HttpClient) {}

  getData(movieName: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
      'x-rapidapi-key': this.apiKey,
    });

    return this.http.get<any>(`${this.apiUrl}search?searchTerm=${movieName}`, {
      headers,
    });
  }

  postData(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
      'x-rapidapi-key': this.apiKey,
    });

    return this.http.post<any>(`${this.apiUrl}data`, payload, { headers });
  }
}
