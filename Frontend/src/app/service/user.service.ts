import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseURL = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http:HttpClient) { }

  get():Observable<any> {
    return this._http.get(`${baseURL}`);
  }

  uploadFormData(data:any):Observable<any> {
    console.log(data);
    return this._http.post(`${baseURL}/upload`,data)
  }

  getAll() {
    return this._http.get(`${baseURL}/upload`)
  }
}
