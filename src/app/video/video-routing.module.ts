import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadsComponent } from './uploads/uploads.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedTo
    },
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'uploads',
    component: UploadsComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedTo
    },
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'manage-clips',
    redirectTo: 'manage',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
