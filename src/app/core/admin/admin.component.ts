import { Component } from '@angular/core';
import { Products } from './admin.model';
import { AdminServiceService } from './admin-service.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AdminFormComponent } from './admin-form/admin-form.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
productData: Products[] = [];
modalRef!: BsModalRef;

constructor(private adminService: AdminServiceService,private modalService: BsModalService){
  this.adminService.getProductData().subscribe(res=>{
    this.productData = res.map((element: any) => {
      const data = element.payload.doc.data();
      const id = element.payload.doc.id;
      return { id, ...data };
    });
  })
}
  // Open Product modal
  openModal() {
    let initialState:ModalOptions = {
      initialState: {
        title: 'Product',
        button: '+ Add',
        closeButton: 'Cancel'
      }
    }
    this.modalRef = this.modalService.show(AdminFormComponent, initialState);
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((data:any) => {
      this.productData.push(data?.data)
    })
  }
  // Edit Product modal
  EditModal(data: Products) {
    let initialState:ModalOptions = {
      initialState: {
        title: 'Product',
        button: '+ Edit',
        closeButton: 'Cancel',
        data: data
      }
    }
    this.modalRef = this.modalService.show(AdminFormComponent, initialState);
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((data:any) => {
      this.productData.push(data?.data)
    })
  }

  deleteProduct(id: string| undefined){
    this.adminService.deleteProduct(id)
  }
}
