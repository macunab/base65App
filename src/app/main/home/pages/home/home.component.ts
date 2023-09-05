import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  base64: string | ArrayBuffer | null = '';

  constructor( private fb: FormBuilder) {}

  imageForm: FormGroup = this.fb.group({
    file: ['', [Validators.required]],
    fileSource: ['', [Validators.required]]
  });

  imageFormSubmit() {

    const submitFile = this.imageForm.get('fileSource')?.value;
    this.imgToBase64(submitFile);
  }

  // Detecta los cambios en el input file y guarda el file en el sourceFile
  onFileChange(event: Event)  {

    const inputElement = event.currentTarget as HTMLInputElement;
    if(inputElement.files?.length! > 0) {
      const inputFile = inputElement.files![0];
      this.imageForm.patchValue({
        fileSource: inputFile
      })
    }
  } 
  
  // Convierte un archivo en string base64
  imgToBase64 =  async (file: File) => {

    return await new Promise<string | ArrayBuffer | null>((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        console.log(reader.result);
        this.base64 = reader.result;
        resolve(reader.result);
      });
       reader.readAsDataURL(file);
    })
  }

}