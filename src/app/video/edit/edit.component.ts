import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating clip.'

  constructor(private modal: ModalService, private clipService: ClipService) { }

  clipID = new FormControl('')
  title = new FormControl('',
  [
    Validators.required,
    Validators.minLength(3)
  ])
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  ngOnChanges(): void {
    if(!this.activeClip){
      return
    }
    
    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  async submit(){
    if(!this.activeClip){
      return
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.'

    try {
      await this.clipService.updateClip(
        this.clipID.value, this.title.value
      )
    } catch (error) {
      console.log(error)
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Try again later'
      this.inSubmission = false;
      return
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip)

    this.alertColor = 'green';
    this.alertMsg = 'Success!'
    this.inSubmission = false;
 
  }
}
