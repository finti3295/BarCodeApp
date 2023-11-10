import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class FileUploadService {
	
// API url
baseApiUrl = "https://192.168.240.190:7261/BarCode/" 
//baseApiUrl = "http://localhost:5063/BarCode/"
	
constructor(private http:HttpClient) { }

// Returns an observable
GetBarCodeFromImageFile(file : any, filename? : string ):Observable<any> {
	//return this.http.get(this.baseApiUrl+"api/Test");
	const formData = new FormData();
		
	formData.append("Image", file);
		
	return this.http.post(this.baseApiUrl+"api/GetBarCodeFromImageFile", formData )
}

GetBarCodeFromImage64(file : any):Observable<any> {  
	const formData = new FormData();
	const data = file.replace(/^data:image\/\w+;base64,/, '');
	formData.append("base64image", data);
	return this.http.post(this.baseApiUrl+"api/GetBarCodeFromImage64", formData)
}

uploadVideo(file : any):Observable<any> {  
	const formData = new FormData();
	formData.append("Video", file);
	return this.http.post(this.baseApiUrl+"api/UploadVideo", formData)
}

}
