import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiConfig } from '../b2c-config';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.css'],
})
export class DataPageComponent implements OnInit {
  options: {
    headers?: HttpHeaders;
    params?: HttpParams;
  } = {
    headers: this.setHeaders(),
  };
  data: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSomeData();
  }
  private getSomeData() {
    const uri = `${apiConfig.uri}/getData`;
    this.http.get(uri, this.options).subscribe({
      next: (data) => {
        console.log(data);
        this.data = data;
        alert('Data retrieved successfully!');
      },
      error: (err) => {
        this.data = null;
        alert(`Failed to retrieve data : ${err}`);
      },
    });
  }
  private setHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key':
        environment.dataServiceConfig.ocpApimSubscriptionKey,
    });
  }
}
