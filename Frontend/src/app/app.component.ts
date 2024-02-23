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

  constructor(private _user:UserService,private fb:FormBuilder) {
    this.myForm = this.fb.group({
      name:[''],
      sampleFile: ['']
    })
   }
  
  ngOnInit() {
    this.get()
    this.getAll()
  }

  get(){
    this._user.get().subscribe({
      next:(data) => {
        console.log(data);
      },
      error: (e) => console.log(e)
    })
  }

  onFileSelect(event: any) {
    console.log('file created');
    const file = event.target.files[0];
    console.log(file);
    this.myForm.patchValue({
      sampleFile: file
    });
    console.log(this.myForm);
    this.myForm.get('sampleFile').updateValueAndValidity();
  }

  onSubmit() {
    const formData = new FormData();

    const file = this.myForm.get('sampleFile').value;
    const name = this.myForm.get('name').value; 
    // console.log('file',file);
    formData.append('sampleFile', file);
    formData.append('name', name);

    this._user.uploadFormData(formData).subscribe({
      next:(data) => {
        this.myForm.get('sampleFile').setValue('');
        this.myForm.get('name').setValue('');
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
