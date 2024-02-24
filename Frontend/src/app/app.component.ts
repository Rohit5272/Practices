import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Frontend';
  myForm: FormGroup;
  uploadedFiles: any = [];
  selectedFileName: string;

  constructor(private _user:UserService,private fb:FormBuilder) {
    this.myForm = this.fb.group({
      name:['', Validators.required],
      packSize:['', Validators.required],
      category:['', Validators.required],
      MRP:['', Validators.required],
      sampleFile: [''],
      status:['', Validators.required]
    })
   }
  
  ngOnInit() {
    this.getAll()
  }

  onFileSelect(event: any) {
    console.log('file created');
    const file = event.target.files[0];
    this.selectedFileName = file ? file.name : '';
    console.log(file);
    this.myForm.patchValue({
      sampleFile: file
    });
    console.log(this.myForm);
    this.myForm.get('sampleFile').updateValueAndValidity();
  }

  preventDefaultSubmit(event: Event) {
    event.preventDefault();
  }

  onSubmit() {
    const formData = new FormData();

    const { name, packSize, category, MRP, sampleFile, status } = this.myForm.value;
    // console.log('file',file);
    formData.append('name', name);
      formData.append('packSize', packSize);
      formData.append('category', category);
      formData.append('MRP', MRP);
      formData.append('sampleFile', sampleFile);
      formData.append('status', status);

    this._user.uploadFormData(formData).subscribe({
      next:(data) => {
        this.myForm.get('name').setValue('');
          this.myForm.get('packSize').setValue('');
          this.myForm.get('category').setValue('');
          this.myForm.get('MRP').setValue('');
          this.myForm.get('sampleFile').setValue('');
          this.myForm.get('status').setValue('');
          console.log(data);
        console.log(data);
      },
      error:(e) => console.log(e)
    })
  }

  getAll() {
    this._user.getAll().subscribe({
      next:(data) => {
        console.log(data);
        this.uploadedFiles = data;
      },
      error:(e) => console.log(e)
    })
  }

  getImageSrc(fileData: any): string {
    return 'data:' + fileData.contentType + ';base64,' + this.arrayBufferToBase64(fileData.data.data);
  }

  // Function to convert ArrayBuffer to base64 string
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
