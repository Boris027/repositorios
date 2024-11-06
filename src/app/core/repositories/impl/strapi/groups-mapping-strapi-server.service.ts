import { Injectable } from "@angular/core";
import { IBaseMapping } from "../../intefaces/base-mapping.interface";
import { Group } from "src/app/core/models/group.model";
import { Paginated } from "src/app/core/models/paginated.model";

@Injectable({
    providedIn: 'root'
})

export class GroupMappingStrapiServer implements IBaseMapping<Group>{

    getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<Group> {
        return{
            page:data.meta.pagination.page,
            pageSize:data.meta.pagination.pageSize,
            pages:data.meta.pagination.pageCount,
            data: data.data.map((d: any) => {
                return this.getOne(d); 
            })
        }
    }
    getOne(data: any): Group {

        let datafinal=(data.data!=undefined)?data.data:data; //esto se pone porque dependiendo de si el dato viene de un paginated o directamente un getone, hace falta poner esto

        const grupo:Group={
            id:datafinal.id+"",
            name:datafinal.attributes.nombre,
            
        }
        return grupo
    }
    getAdded(data: any): Group {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any): Group {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any): Group {
        throw new Error("Method not implemented.");
    }
    setAdd(data: Group) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }

    
}