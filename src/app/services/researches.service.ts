import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ResearchesService {
  apiUrl = environment.apiUrl;
  link = "researches";

  constructor(private _httpClient: HttpClient) {}

  getAllResearches(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiUrl}/${this.link}`);
  }
  deleteResearches(usherId) {
    return this._httpClient.delete(`${this.apiUrl}/${this.link}/${usherId}`, {
      observe: "response",
    });
  }

  addResearch(body: any) {
    return this._httpClient.post(`${this.apiUrl}/${this.link}`, body);
  }

  UpdateResearchesData(body: any, researchId: string) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}`,
      body
    );
  }

  getSingleResearch(researchId) {
    return this._httpClient.get(`${this.apiUrl}/${this.link}/${researchId}`);
  }

  getSingleResearchInvestigators(researchId: string) {
    return this._httpClient.get(
      `${this.apiUrl}/${this.link}/${researchId}/investigators`
    );
  }

  getSingleResearchRank(researchId: string) {
    return this._httpClient.get(
      `${this.apiUrl}/${this.link}/${researchId}/rank`
    );
  }

  getSingleResearchCommonParameters(researchId: string) {
    return this._httpClient.get(
      `${this.apiUrl}/${this.link}/${researchId}/parameters`
    );
  }

  updateParameters(researchId: string, data: object) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/parameters`,
      { commonParameters: { ...data } }
    );
  }

  calcRank(researchId: string, userId: string) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/rank`,
      { userId: userId }
    );
  }

  participate(researchId: string, data: object) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/participate`,
      data
    );
  }

  deleteInvestigator(researchId: string, investigatorId: string) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/investigators`,
      { investigatorId }
    );
  }
}
