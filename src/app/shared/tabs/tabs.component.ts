import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  
  @Input() tabTitle: string = '';
  @Input() active: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
