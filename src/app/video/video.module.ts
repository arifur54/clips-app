import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadsComponent } from './uploads/uploads.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SafeURLPipe } from './pipe/safe-url.pipe';


@NgModule({
  declarations: [
    ManageComponent,
    UploadsComponent,
    EditComponent,
    SafeURLPipe,
  
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    EditComponent
  ]
})
export class VideoModule { }
