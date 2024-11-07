import { Inject, Injectable } from "@angular/core";
import { Model } from "src/app/core/models/base.model";
import { BaseRepositoryHttpService } from "../base-repository-http.service";
import { HttpClient } from "@angular/common/http";
import { API_URL_TOKEN, GROUPS_RESOURCE_NAME_TOKEN, REPOSITORY_MAPPING_TOKEN, RESOURCE_NAME_TOKEN } from "../../repository.tokens";
import { IBaseMapping } from "../../intefaces/base-mapping.interface";
import { map, Observable } from "rxjs";
import { Paginated } from "src/app/core/models/paginated.model";

@Injectable({
    providedIn: 'root'
  })
  export class StrapiServerRepositoryService<T extends Model> extends BaseRepositoryHttpService<T>{

    constructor(
        http: HttpClient,
        @Inject(API_URL_TOKEN) apiUrl: string, // URL base de la API para el modelo
        @Inject(RESOURCE_NAME_TOKEN) resource:string, //nombre del recurso del repositorio
        @Inject(GROUPS_RESOURCE_NAME_TOKEN) private resource2:string, //nombre del recurso, nombre de la tabla a la que se relaciona, por ejemplo persona se relacion con grupo
        @Inject(REPOSITORY_MAPPING_TOKEN) mapping:IBaseMapping<T>//nombre del recurso del repositorio
      ) {
        super(http, apiUrl, resource, mapping);
      }



      override getAll(page:number, pageSize:number): Observable<T[] | Paginated<T>> {
        const resource2final=this.resource2.substring(0,this.resource2.length-1)
        if(page!=-1){
          return this.http.get<Paginated<T>>(`${this.apiUrl}/${this.resource}?populate=${resource2final}&sort[0]=id&pagination[page]=${page}&pagination[pageSize]=${pageSize}`).pipe(map(res=>this.mapping.getPaginated(page, pageSize, 0, res)));
        }else{
          return this.http.get<Paginated<T>>(`${this.apiUrl}/${this.resource}?populate=${resource2final}&sort[0]=id&pagination[page]=${page}&pagination[pageSize]=${pageSize}`).pipe(map(res=>this.mapping.getPaginated(page, pageSize, 0, res)));
        }
        
      }

      override getById(id: string): Observable<T | null> {
        return this.http.get<T>(`${this.apiUrl}/${this.resource}/${id}`).pipe(map(res=>this.mapping.getOne(res)));
      }

      override add(entity: T): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${this.resource}`, this.mapping.setAdd(entity)).pipe(map(res=>this.mapping.getUpdated(res)));
      }

      override update(id: string, entity: T): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${this.resource}/${id}`, this.mapping.setAdd(entity)).pipe(map(res=>this.mapping.getUpdated(res)));
      }

      
      



  }