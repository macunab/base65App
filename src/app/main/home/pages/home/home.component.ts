import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent {

  base64: string | ArrayBuffer | null = '';

  constructor( private fb: FormBuilder, private clipboard: Clipboard,
      private messageService: MessageService) {}

  imageForm: FormGroup = this.fb.group({
    file: ['', [Validators.required]],
    fileSource: ['', [Validators.required]]
  });
  base64Html: string = '';
  base64CSS: string = '';

  imageFormSubmit() {

    const submitFile: File = this.imageForm.get('fileSource')?.value;
    if(submitFile) {
      this.imgToBase64(submitFile);
    } else {
      this.messageService.add({ severity: 'error', detail: 'Primero seleccione un archivo' });
    }
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
        this.base64 = reader.result;
        this.base64Html = `<img src="${this.base64}" />`;
        this.base64CSS = `background-image: url(${this.base64})`;
        resolve(reader.result);
      });
       reader.readAsDataURL(file);
    })
  }


  // Copia el contenido al clipboard
  copy(value: string | ArrayBuffer | null): void {
    
    this.clipboard.copy(String(value));
    this.messageService.add({severity: 'success', detail: 'El resultado se ha copiado con exito!'});
  }

}