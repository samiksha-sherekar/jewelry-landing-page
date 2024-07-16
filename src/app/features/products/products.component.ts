import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AdminServiceService } from 'src/app/core/admin/admin-service.service';
import { Products } from 'src/app/core/admin/admin.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  productData: Products[] = [];
  userPhoneNumber: string = '';
  modalRef?: BsModalRef| null;

  constructor(private adminService: AdminServiceService,private modalService: BsModalService,public bsModalRef: BsModalRef){
    this.adminService.getProductData().subscribe(res=>{
      this.productData = res.map((element: any) => {
        const data = element.payload.doc.data();
        const id = element.payload.doc.id;
        return { id, ...data };
      });
    })
  }

  openModal(whatsappModal:any) {
    this.modalService.show(whatsappModal);
  }
  redirectToWhatsApp() {
    if (this.userPhoneNumber.trim() !== '') {
      const message = 'Hello! I would like to chat with you.'; // Optional predefined message
      const url = `https://wa.me/${this.userPhoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      this.bsModalRef.hide();
    } else {
      alert('Please enter a valid phone number.');
    }
  }
  closeFirstModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalRef.hide();
    this.modalRef = null;
  }
}
