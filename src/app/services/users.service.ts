import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  apiUrl = environment.apiUrl;
  link = "users";

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${this.link}`);
  }
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/local/register`, user);
  }
  AddUsers(body) {
    const headers = new HttpHeaders({
      // tslint:disable-next-line:max-line-length
    });
    return this.http.post<any>(`${this.apiUrl}/${this.link}`, body, {
      headers: headers,
      observe: "response",
    });
  }

  update(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${this.link}/${id}`, data, {
      observe: "response",
    });
  }

  updateInvestigator(id: string, data: object) {
    return this.http.put(
      `${this.apiUrl}/${this.link}/${id}/investigator`,
      data
    );
  }

  getUserResearch(userId: string, researchId: string) {
    let params = new HttpParams();
    params = params.append("research", researchId);
    return this.http.get(`${this.apiUrl}/${this.link}/${userId}`, {
      observe: "response",
      params: params,
    });
  }

  getUser(userId: string) {
    return this.http.get(`${this.apiUrl}/${this.link}/${userId}`, {
      observe: "response",
    });
  }

  getUserParameters(id: string) {
    return this.http.get(`${this.apiUrl}/${this.link}/${id}/parameters`, {
      observe: "response",
    });
  }

  updateParameters(id: string, data: object) {
    return this.http.put(`${this.apiUrl}/${this.link}/${id}/parameters`, data, {
      observe: "response",
    });
  }

  participate(data: object, userId: string) {
    return this.http.put(
      `${this.apiUrl}/${this.link}/${userId}/participate`,
      data
    );
  }

  deleteResearch(userId: string, researchId: string) {
    return this.http.put(`${this.apiUrl}/${this.link}/${userId}/research`, {
      researchId: researchId,
    });
  }
}
