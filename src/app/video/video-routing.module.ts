import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadsComponent } from './uploads/uploads.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true
    },
  },
  {
    path: 'uploads',
    component: UploadsComponent,
    data: {
      authOnly: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
