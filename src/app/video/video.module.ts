import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadsComponent } from './uploads/uploads.component';


@NgModule({
  declarations: [
    ManageComponent,
    UploadsComponent
  ],
  imports: [
    CommonModule,
    VideoRoutingModule
  ]
})
export class VideoModule { }
