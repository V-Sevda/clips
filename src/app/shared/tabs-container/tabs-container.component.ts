import { Component, OnInit,AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  //ContentChildren(): is a decorator in which we placed the TabComponent. This decorator allows us to select elements from projected content.
  //This way, we have created an object full of TabComponents and we can count how many tabs we have.
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList()//QueryList object can store and array of items. This way, we can access the "tabs" property. Now we can call the methods and the properties of the "tabs"

  constructor() {}
  //AfterContentInit: we grab the items after the load of the browser.This way we can return as much tabs as we like.
  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    )
    //check if the active tab array is empty
    if (!activeTabs || activeTabs.length === 0){
      this.selectTab(this.tabs!.first)
    }
  }
  selectTab(tab: TabComponent){
    this.tabs?.forEach(tab => {
      tab.active = false
    })

    tab.active = true

    return false //this way, we remove the '#' form eh URL
  }
}
