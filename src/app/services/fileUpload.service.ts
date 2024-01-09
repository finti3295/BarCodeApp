import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
providedIn: 'root'
})
export class FileUploadService {
		
constructor(private http:HttpClient) { }

// Returns an observable
GetBarCodeFromImageFile(file : any, filename? : string ):Observable<any> {
	//return this.http.get(this.baseApiUrl+"api/Test");
	const formData = new FormData();
		
	formData.append("Image", file);
		console.log(environment.serverUrl+ environment.BarCodeApi+environment.GetBarCodeFromImageFile);
	return this.http.post(environment.serverUrl+ environment.BarCodeApi + environment.GetBarCodeFromImageFile, formData )
}

GetBarCodeFromImage64(file : any):Observable<any> {  
	const formData = new FormData();
	const data = file.replace(/^data:image\/\w+;base64,/, '');
	formData.append("base64image", data);
	return this.http.post(environment.serverUrl+environment.BarCodeApi+environment.GetBarCodeFromImage64, formData)
}

uploadVideo(file : any, filename: string | undefined):Observable<any> {  
	const formData = new FormData();
	formData.append("Video", file, filename);
	return this.http.post(environment.serverUrl+environment.BarCodeApi+environment.UploadVideo, formData)
}

}
