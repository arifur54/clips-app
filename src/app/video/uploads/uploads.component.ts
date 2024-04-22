import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import {v4 as uuid} from 'uuid';
import {last, switchMap} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin  } from 'rxjs';



@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnDestroy {

  isDragOver: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;

  inSubmission = false;
  showAlert = false;
  alertMsg = '';
  alertColor = '';
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null ;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenShot = '';
  screenShotTask?: AngularFireUploadTask

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user);
    this.ffmpegService.init();
   }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  title = new FormControl('',
  [
    Validators.required,
    Validators.minLength(3)
  ])
  uploadForm = new FormGroup({
    title: this.title
  })

  async storeFile($event: Event) {
    if(this.ffmpegService.isRunning){
      return;
    }


    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }
    
    this.screenshots = await this.ffmpegService.getScreenShots(this.file);

    this.selectedScreenShot = this.screenshots[0];

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );
    this.nextStep = true
   
  }

  async uploadFile(){
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenShotBlob = await this.ffmpegService.blobFromUrl(
      this.selectedScreenShot
    )

    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    const screenShotRef = this.storage.ref(screenshotPath);

    this.screenShotTask = this.storage.upload(screenshotPath, screenShotBlob);

    combineLatest(
      [
        this.task.percentageChanges(),
        this.screenShotTask.percentageChanges()
      ]
    ).subscribe((progress) => {
      const [clipProgress, screenShotProgress] = progress
      if(!clipProgress || !screenShotProgress){
        return
      }
      const total = clipProgress + screenShotProgress;
      this.percentage = total as number / 200
    })

    forkJoin(
      [
        this.task.snapshotChanges(),
        this.screenShotTask.snapshotChanges()
      ]).pipe(
      switchMap(() => forkJoin(
        [
          clipRef.getDownloadURL(),
          screenShotRef.getDownloadURL()
        ]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls

        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipsService.createClip(clip);

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000)

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
