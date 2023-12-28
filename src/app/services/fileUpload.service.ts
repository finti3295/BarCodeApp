import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
providedIn: 'root'
})
export class FileUploadService {
	
// API url
//baseApiUrl = "https://192.168.240.190:7261/BarCode/" 
//baseApiUrl = "http://localhost:5063/BarCode/"
//baseApiUrl = "https://192.168.1.6:7261/BarCode/" 
	
constructor(private http:HttpClient) { }

// Returns an observable
GetBarCodeFromImageFile(file : any, filename? : string ):Observable<any> {
	//return this.http.get(this.baseApiUrl+"api/Test");
	const formData = new FormData();
		
	formData.append("Image", file);
		console.log(environment.serverUrl+ environment.baseApiUrl+environment.GetBarCodeFromImageFile);
	return this.http.post(environment.serverUrl+ environment.baseApiUrl + environment.GetBarCodeFromImageFile, formData )
}

GetBarCodeFromImage64(file : any):Observable<any> {  
	const formData = new FormData();
	const data = file.replace(/^data:image\/\w+;base64,/, '');
	formData.append("base64image", data);
	return this.http.post(environment.serverUrl+environment.baseApiUrl+environment.GetBarCodeFromImage64, formData)
}

uploadVideo(file : any):Observable<any> {  
	const formData = new FormData();
	formData.append("Video", file);
	return this.http.post(environment.serverUrl+environment.baseApiUrl+environment.UploadVideo, formData)
}

}
