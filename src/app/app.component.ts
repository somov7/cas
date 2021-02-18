import {Component} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    image: File = undefined;
    loaded: boolean = false;
    gif = undefined;

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    saveImage(event): void {
        this.image = <File>event.target.files[0]
    }

    onSubmit(event): void {
        event.preventDefault()
        this.loaded = true;
        let formData:FormData = new FormData()
        formData.append('image', this.image)
        this.http.post(`http://localhost:8000/scale`,
            formData,
            {'responseType': 'blob'})
            .subscribe(
                data => {
                    console.log(data)
                    let objectURL = URL.createObjectURL(data);
                    this.gif = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                    console.log(this.gif)
                }
            )
    }


}
