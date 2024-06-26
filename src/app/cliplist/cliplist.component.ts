import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cliplist',
  templateUrl: './cliplist.component.html',
  styleUrls: ['./cliplist.component.css'],
  providers: [DatePipe]
})
export class CliplistComponent implements OnInit, OnDestroy {
  @Input() scrollable = true;

  constructor(public clipService: ClipService) { 
    this.clipService.getClips();
  }

  ngOnInit(): void {
    if(this.scrollable){
      window.addEventListener('scroll', this.handleScroll);
    }
    
  }

  ngOnDestroy(): void {
    if(this.scrollable){
      window.addEventListener('scroll', this.handleScroll);
    }

    this.clipService.pageClips = [];
  }

  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
    
    if(bottomOfWindow){
      console.log("Bottom of the page")
      this.clipService.getClips();
    }

  }

}
