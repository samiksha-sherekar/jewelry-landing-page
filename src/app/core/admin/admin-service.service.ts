import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Products } from './admin.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  public productCollection!: AngularFirestoreCollection<Products>

  constructor(private db: AngularFirestore,) { 
    this.productCollection = db.collection('products')
  }

  getProductData() { 
    return this.db.collection('products').snapshotChanges()
  }

  async addProduct(data: Products)  {
    return this.db.collection('products').add(data);
  }

  getProductByID(id: string): Observable<Products | undefined> {
    return this.db.collection('products').doc(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as Products | undefined;
        if (data) {
          const id = action.payload.id;
          return { id, ...data };
        } else {
          return undefined; 
        }
      })
    );
  }

  getProductUpdate(id:string, data: Products){
    return this.db.collection('products').doc(id).update(data);
  }

  deleteProduct(id:string| undefined){
    return this.db.collection('products').doc(id).delete()
  }
}
