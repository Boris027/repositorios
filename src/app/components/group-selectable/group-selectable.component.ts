import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonInput, IonPopover } from '@ionic/angular';
import { BehaviorSubject, Subscription, last, lastValueFrom } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';


@Component({
  selector: 'app-group-selectable',
  templateUrl: './group-selectable.component.html',
  styleUrls: ['./group-selectable.component.scss'],
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupSelectableComponent),
    multi: true
  }]
})
export class GroupSelectableComponent  implements OnInit, ControlValueAccessor, OnDestroy {

  groupSelected:Group | null = null;
  disabled:boolean = true;
  private _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  public groups$ = this._groups.asObservable();
  pagination!:Paginated<Group>;
  private pagesize=5


  propagateChange = (obj: any) => {}

  @ViewChild('popover', { read: IonPopover }) popover: IonPopover | undefined;

  constructor(
    public gropsSvc:GroupsService
  ) { 
  }
  ngOnDestroy(): void {
    this.popover?.dismiss();
  }
  
  onLoadGroups(){
    this.loadGroups("");
  }

  private async loadGroups(filter:string){
    this.gropsSvc.getAll(1,this.pagesize).subscribe({
      next:response=>{
        this.pagination=response
        this._groups.next([...response.data]);
      },
      error:err=>{}
    }) 
  }

  private async loadGroupsmore(page:number,pageSize:number){
    this.gropsSvc.getAll(page,pageSize).subscribe({
      next:response=>{
        this.pagination=response;
        const content=this._groups.getValue()
        this._groups.next([...content,...response.data]);
      },
      error:err=>{}
    }) 
  }

  private async selectGroup(id:string|undefined, propagate:boolean=false){
    if(id){
      this.groupSelected  = await lastValueFrom(this.gropsSvc.getById(id));
    }
    else
      this.groupSelected = null;
    if(propagate && this.groupSelected)
      this.propagateChange(this.groupSelected.id);
  }
  
  writeValue(obj: any): void {
    this.selectGroup(obj);
      
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {

  }

  private async filter(filtering:string){

    if(filtering!=""){
      let groups:Group[]=[]
      this.gropsSvc.getAll().subscribe({
        next:(value)=>{
          groups=value.filter(c=>c.name.includes(filtering))
          this._groups.next(groups)
        },
      })
    }else{
      this.loadGroups(filtering);
    }
  }

  onFilter(evt:any){

    this.filter(evt.detail.value);
  }

  onGroupClicked(popover:IonPopover, group:Group){
    this.selectGroup(group.id, true);
    popover.dismiss();
  }

  clearSearch(input:IonInput){
    input.value = "";
    this.filter("");
  }

  deselect(popover:IonPopover|null=null){
    if (this.propagateChange) {
      this.propagateChange(null);  // Aquí propagamos el cambio para el form control
    }
    this.selectGroup(undefined, true);
    if(popover)
      popover.dismiss();
  }

  onIonInfinite(event:InfiniteScrollCustomEvent){
    /*if(this.actualpage<this.totalpages){
      this.actualpage+=1
      this.loadGroupsmore(this.actualpage,this.pagesize)
      event.target.complete()
    }*/

      if((this.pagination.page)<(this.pagination.pages)){
        this.loadGroupsmore((this.pagination.page+1),this.pagesize)

      }

      event.target.complete()
  }
}
