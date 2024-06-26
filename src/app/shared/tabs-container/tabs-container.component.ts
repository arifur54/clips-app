import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabsComponent) tabs?: QueryList<TabsComponent>;

  constructor() { }
  
  ngAfterContentInit(): void {
    const activeTab = this.tabs?.filter(tab => tab.active);

    if(!activeTab || activeTab.length === 0){
      this.selectTab(this.tabs!.first)
    }

  }

  selectTab(tab: TabsComponent): boolean {
    this.tabs?.forEach(tab => {
      tab.active = false;
    })

    tab.active = true;
    return false;
  }

  getTabClasses(tab: TabsComponent): any {
    return {
      'hover:text-white text-white bg-indigo-400': tab.active,
      'hover:text-indigo-400': !tab.active
    };
  }

}
