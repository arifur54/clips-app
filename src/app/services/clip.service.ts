import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot} from '@angular/fire/compat/firestore'
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  public clipCollection: AngularFirestoreCollection<IClip>
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth
  ) { 
    this. clipCollection = db.collection('clips')
  }

  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
   return await this.clipCollection.add(data)
  }

  getUserClips(){
    return this.auth.user.pipe(
      switchMap(user => {
        if(!user){
          return of([])
        }

        const query = this.clipCollection.ref.where(
          'uid', '==', user.uid
        )

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)

    )
  }

}
