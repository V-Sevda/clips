import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest } from 'rxjs';////the combineLatest: it's going to help us with subscribing to multiple observables.
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  public clipsCollection: AngularFirestoreCollection<IClip> //type checking is a priority (models/clip.model.ts)
  pageClips: IClip[] = []
  pendingReq = false

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips')
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>>{
    return this.clipsCollection.add(data)
  }

  getUserClips(sort$: BehaviorSubject<string>){
    return combineLatest([     //we use the combineLatest() func and as properties we pass in an array with auth.user,sort$
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {    //change the user with values
        const [user, sort] = values  //create an array with [user, sort] and place the values in it

        if(!user){      //we check if there is the current user. If there is not it returns an empty arrey with the of()
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid  //this will check if the uid of the clip is equal with the users id who is logged in
        ).orderBy(     //Last, we use the orderBy() with timestamp and sort
          'timestamp',
          sort === '1' ? 'desc' : 'asc' //if sort==='1' then 'desc' else 'asc'
        )

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    }) //from the collection we select a document(clip) from its id
  }

  async deleteClip(clip: IClip){
    const clipRef = this.storage.ref(`clips/${clip.fileName}`) //we follow the path/reference of the file in the storage/clips/clip.filename
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)

    await clipRef.delete() //We delete the selected file from the storage
    await screenshotRef.delete()

    await this.clipsCollection.doc(clip.docID).delete() //we delete the document
  }

  async getClips(){
    //Check if the user trigger the request multiple times
    if(this.pendingReq){
      return
    }

    this.pendingReq = true

    let query = this.clipsCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(6) //retrive the first 6 from database

    const { length } = this.pageClips

    if(length){
      //We're grabbing the ID so that we can perform a query for an individual document after the variable
      const lastDocID = this.pageClips[length - 1].docID //store the ID of the last stored document(file)
      const lastDoc = await this.clipsCollection.doc(lastDocID) //we get a document by its ID. It returns a snapshot of the document
        .get()
        .toPromise()

      query = query.startAfter(lastDoc) //startAfter: Telling Firebase, you start looking for documents after a specific document.
    }
    //Initiate the request. DB will not send data until we send the req
    const snapshot = await query.get()
    //post the document data from our query into the page documents erase snapshots or arrays so we can loop through them
    snapshot.forEach(doc => {
      this.pageClips.push({   //push this data into the documents array with a spread operator.
        docID: doc.id,
        ...doc.data()
      })
    })

    this.pendingReq = false
  }
  resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    return this.clipsCollection.doc(route.params.id)
      .get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data()

          if(!data){
            this.router.navigate(['/'])
            return null
          }

          return data
        })
      )
  }
}
