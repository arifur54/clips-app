import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {v4 as uuid} from 'uuid';
import {last, switchMap} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {

  isDragOver: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;

  inSubmission = false;
  showAlert = false;
  alertMsg = '';
  alertColor = '';
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null 

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
  ) {
    auth.user.subscribe(user => this.user = user)
   }

  ngOnInit(): void {
  }

  title = new FormControl('',
  [
    Validators.required,
    Validators.minLength(3)
  ])
  uploadForm = new FormGroup({
    title: this.title
  })

  storeFile($event: Event) {
    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }
    
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );
    this.nextStep = true
   
  }

  uploadFile(){
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`;

    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }

        this.clipsService.createClip(clip);

        this.alertColor = 'green'
        this.alertMsg =  'Success! Your Clip has been uploaded'
        this.showPercentage = false
      },
      error: (error) => {
        this.uploadForm.enable();
        this.alertColor = 'red'
        this.alertMsg = 'Upload failed! Please try again'
        this.inSubmission = false
        this.showPercentage = false
        console.error(error.code)
      }
    })
      

  }
  

}
