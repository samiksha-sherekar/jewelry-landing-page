import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AdminServiceService } from '../admin-service.service';
import { Products } from '../admin.model';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss']
})
export class AdminFormComponent {
  @Output() event: EventEmitter<any> = new EventEmitter();
  productForm!: FormGroup;
  isSubmitted: boolean = false;
  id: any;
  title? : string;
  button?: string;
  closeButton?: string;
  data?: Products;
  editMode: boolean = false;
  imageDisplay!: any;
  constructor(
                private _productService: AdminServiceService,
                public bsModalRef: BsModalRef
              ){

    // Category Form Initialization
    this.productForm = new FormGroup({
      productName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      price: new FormControl<number | null>(null, [Validators.required]),
      image: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  ngOnInit(){
    this.checkEdit()
  }
  // Image Upload
  fileUpload(event: any):void {
    if ( event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDisplay = e.target.result;
        this.productForm.patchValue({ image: e.target.result });
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  // Check Edit Form
  checkEdit(){
      if(this.data){
        this.id = this.data.id;
        this.editMode = true;
        this.title = 'Product';
        this._productService.getProductByID(this.id).subscribe({
          next: (response:any)=>{
            if(response){
              this.productForm.patchValue(response);
              this.imageDisplay = response.image;
            }
          },
          error: (err:any)=>{
            alert(err)
          }
        })
      }
  }
  // Form Submit Start
  saveCategory(){
    this.isSubmitted = true;
    if (this.productForm.invalid) {
      return;
    }
    const formData = this.productForm.value;
    if(this.editMode){
      this._productService.getProductUpdate(this.id,formData);
      this.bsModalRef.hide()
    }else{
      this._productService.addProduct(formData);
      this.bsModalRef.hide()
    }
  }
}

