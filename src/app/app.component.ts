import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    image: File = undefined;

    state: string;
    gif = undefined;
    @ViewChild('file')
    fileInput: ElementRef;

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    isValid(): boolean {
        return this.image !== undefined && (this.image.type === 'image/png' || this.image.type === 'image/jpeg');
    }

    saveImage(event): void {
        this.image = (event.target.files[0] as File);
    }

    onSubmit(event): void {
        event.preventDefault();
        this.state = 'loading';
        const formData: FormData = new FormData();
        formData.append('image', this.image);
        this.image = undefined;
        this.fileInput.nativeElement.value = '';
        this.http.post(`https://content-aware-scaling-server.herokuapp.com/scale`,
            formData,
            {responseType: 'blob'})
            .subscribe(
                data => {
                    console.log(data);
                    const objectURL = URL.createObjectURL(data);
                    this.gif = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                    console.log(this.gif);
                    this.state = 'loaded';
                },
                error => {
                    console.log(error);
                    this.state = 'error';
                }
            );
    }


}
