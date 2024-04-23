import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot} from '@angular/fire/compat/firestore'
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {

  public clipCollection: AngularFirestoreCollection<IClip>
  pageClips: IClip[] = [];
  pendingRequest = false;


  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) { 
    this.clipCollection = db.collection('clips')
  }

  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
   return await this.clipCollection.add(data)
  }

  getUserClips(sort$: BehaviorSubject<string>){
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values;
        
        if(!user){
          return of([])
        }

        const query = this.clipCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort == '1' ? 'desc' : 'asc'
        )

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)

    )
  }

  updateClip(id: string, title: string ){
    return this.clipCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenShotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)
    try {
      await clipRef.delete();
      await screenShotRef.delete()
      await this.clipCollection.doc(clip.docID).delete()
    } catch (error) {
      console.log(error)
    }
    
    
  }

  async getClips() {
    if(this.pendingRequest){
      return
    }

    this.pendingRequest = true;
    let query = this.clipCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(6);
  
    const { length } = this.pageClips
    
    if(length){
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await this.clipCollection.doc(lastDocID)
        .get()
        .toPromise()
        // removed toPromise
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    snapshot.forEach((doc) => {
        this.pageClips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    
    this.pendingRequest = false;

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IClip | Observable<IClip | null> | Promise<IClip | null> | null {
    return this.clipCollection.doc(route.params.id)
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
