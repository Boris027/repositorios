// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GroupsRepositoryFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people.service';
import { GROUPS_API_URL_TOKEN, GROUPS_REPOSITORY_MAPPING_TOKEN, GROUPS_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN } from './core/repositories/repository.tokens';
import { provideHttpClient } from '@angular/common/http';
import { PeopleLocalStorageMapping } from './core/repositories/impl/localstorage/people-mapping-local-storage.service';
import { PeopleMappingJsonServer } from './core/repositories/impl/json-server/people-mapping-json-server.service';
import { GroupsMappingJsonServer } from './core/repositories/impl/json-server/groups-mapping-json-server.service';
import { GroupsService } from './core/services/impl/groups.service';
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupSelectableComponent } from './components/group-selectable/group-selectable.component';
import { GroupMappingStrapiServer } from './core/repositories/impl/strapi/groups-mapping-strapi-server.service';
import { PeopleMappingStrapiServer } from './core/repositories/impl/strapi/people-mapping-strapi-server.service';
import { StrapiServerRepositoryService } from './core/repositories/impl/strapi/strapi-server.repository';
@NgModule({
  declarations: [AppComponent, PersonModalComponent, GroupSelectableComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'personas' },
    { provide: GROUPS_RESOURCE_NAME_TOKEN, useValue: 'grupos' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: /*'http://localhost:3000'*/ 'http://localhost:1337/api' },
    { provide: GROUPS_API_URL_TOKEN, useValue: /*'http://localhost:3000'*/ 'http://localhost:1337/api' },
    // Registrar los repositorios
    { 
      provide: PEOPLE_REPOSITORY_MAPPING_TOKEN, 
      useClass: PeopleMappingStrapiServer
    },
    { 
      provide: GROUPS_REPOSITORY_MAPPING_TOKEN, 
      useClass: GroupMappingStrapiServer
    },
    PeopleRepositoryFactory,
    GroupsRepositoryFactory,
    // Registrar otros repositorios según sea necesario
    // Servicios de aplicación
    {
      provide: 'PeopleService',
      useClass: PeopleService
    },
    {
      provide: 'GroupsService',
      useClass: GroupsService
    }
    // ... otros proveedores],

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
