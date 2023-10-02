import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class FileUploadService {
	
// API url
baseApiUrl = "http://localhost:56395/"
	
constructor(private http:HttpClient) { }

// Returns an observable
GetBarCodeFromImageFile(file : any, filename : string ):Observable<any> {
	const formData = new FormData();
		
	formData.append("Image", file);
		
	return this.http.post(this.baseApiUrl+"api/GetBarCodeFromImageFile", formData )
}

GetBarCodeFromImage(file : any):Observable<any> {  
	const formData = new FormData();
	const data = file.replace(/^data:image\/\w+;base64,/, '');
	formData.append("base64image", data);
	return this.http.post(this.baseApiUrl+"api/GetBarCodeFromImage", formData)
}

uploadVideo(file : any):Observable<any> {  
	const formData = new FormData();
	formData.append("Video", file);
	return this.http.post(this.baseApiUrl+"api/UploadVideo", formData)
}

}
