import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(
    public modal: ModalService,
    public auth: AuthService,
  ){}

  ngOnInit(): void {

  }
  openModal($event: Event){
    $event.preventDefault()// The preventDefault() function will prevent the default behavior of the browser by calling this method.Users will not unexpectedly be redirected to a different page

    this.modal.toggleModal("auth")
  }


}
