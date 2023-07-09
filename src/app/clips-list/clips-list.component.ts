import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy{
  @Input() scrollable = true //Disable infinite scrolling

  constructor(
    public clipService: ClipService
  ){
    this.clipService.getClips()
  }

  ngOnInit(): void {
    //Disable infinite scrolling
    if(this.scrollable){
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  ngOnDestroy(): void {
    //Disable infinite scrolling
    if(this.scrollable){
      window.removeEventListener('scroll', this.handleScroll)
    }

    this.clipService.pageClips = [] //Clear the array
  }

  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement
    const { innerHeight } = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight // Check if the scroll top and inner height properties are equal to the offset height

    if(bottomOfWindow){
      this.clipService.getClips()
    }
  }

}
