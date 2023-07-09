import { Injectable } from '@angular/core';
import { elementAt } from 'rxjs';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = []

  constructor() { }

  register(id: string){
    this.modals.push({
      id,
      visible: false
    })
  }

  unregister(id: string) {
    this.modals = this.modals.filter(
      element => element.id !== id
    )
  }

  isModalOpen(id: string) : boolean{
    return !!this.modals.find(element => element.id === id)?.visible //the '!!' is a way to restrict the type of our parametere in to boolean. We put double '!!' to keep our result the same as it was. true->true
  }

  toggleModal(id: string){
    const modal = this.modals.find(element => element.id === id)

    if (modal) {
      modal.visible = !modal.visible
    }
    // this.visible = !this.visible
  }

}
