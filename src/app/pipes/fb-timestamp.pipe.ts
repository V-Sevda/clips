import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe){

  }

  transform(value: firebase.firestore.FieldValue | undefined){
    if(!value){//check if is emty and return an emty string
      return ''
    }
    const date = (value as firebase.firestore.Timestamp).toDate() //the toDate() function needed to assert the type of the value property

    return this.datePipe.transform(date, 'mediumDate')
  }

}
