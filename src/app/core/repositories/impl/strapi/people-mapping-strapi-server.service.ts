import { Inject, Injectable } from "@angular/core";
import { IBaseMapping } from "../../intefaces/base-mapping.interface";
import { Person } from "src/app/core/models/person.model";
import { Paginated } from "src/app/core/models/paginated.model";

@Injectable({
    providedIn: 'root'
  })

export class PeopleMappingStrapiServer implements IBaseMapping<Person>{

    getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<Person> {
        return{
            page:data.meta.pagination.page,
            pageSize:data.meta.pagination.pageSize,
            pages:data.meta.pagination.pageCount,
            data: data.data.map((d: any) => {
                return this.getOne(d); 
            })
        }
    }

    getOne(data: any): Person {

        let genero="Otros";

        if(data.attributes.genero=="male"){
            genero="Masculino"
        }else if(data.attributes.genero=="female"){
            genero="Femenino"
        }

        const persona:Person={
            id:data.id+"",
            name:data.attributes.nombre,
            surname:data.attributes.apellidos,
            email:data.attributes.email,
            gender:genero,
            age:data.attributes.edad,
            groupId:data.attributes.grupo.data.id+""
        }

        

        return persona;
    }

    getAdded(data: any): Person {
        return this.getOne(data);
    }
    getUpdated(data: any): Person {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any): Person {
        return this.getOne(data);
    }
    setAdd(data: Person) {
        let genero="other"

        if(data.gender=="Masculino"){
            genero="male"
        }else if(data.gender="Femenino"){
            genero="female"
        }

        console.log(data)

        return{
            "data":{
                nombre:data.name,
                apellidos:data.surname,
                email:data.email,
                genero:genero,
                edad:parseInt((data.age??0)+""),
                ...(data.groupId ? { grupo: parseInt(data.groupId) } : {})  
            }
        }
    }
    setUpdate(data: any) {
        return this.getOne(data);
    }

}