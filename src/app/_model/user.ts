import { AuthTokenModel } from "./authtokenmodel";



export class User {



    username: string;
    //AuthTokenModel: AuthTokenModel;
    role: string[];
    access_token: string;
    refresh_token: string;
    id_token: string;
    expires_in: number;
    token_type: string;
    expiration_date: Date;

    public get tokenValue(): string {
        return this.access_token;
    }

    SetAuthTokenModel(tokens: AuthTokenModel) {
    this.access_token = tokens.access_token;
    this.refresh_token= tokens.refresh_token;
    this.id_token= tokens.id_token;
    this.expires_in= tokens.expires_in;
    this.token_type= tokens.token_type;
    this.expiration_date= tokens.expiration_date;
    console.log("SetAuthTokenModel #Date.now() :"+ new Date()+ " expiration_date "+(this.expiration_date)+" tokens.expiration_date "+tokens.expiration_date);
    }

  
    public get GetAuthTokenModel(): AuthTokenModel {
        var tokens = new AuthTokenModel();
        tokens.access_token=this.access_token ;
        tokens.refresh_token =this.refresh_token;
        tokens.id_token =this.id_token;
        tokens.expires_in = this.expires_in;
        tokens.token_type =this.token_type;
        tokens.expiration_date =this.expiration_date;
        return tokens;
    }

    // public static IsValidToken(u:User) : boolean{
    //     console.log("#Date.now() :"+ new Date()+ " expiration_date "+(u.expiration_date));
    //     //console.log("expires_in"+u.expires_in+" #Date().getTime() :"+ new Date().getTime()/1000+ " <expires token"+(new Date(new Date().getTime() + u.expires_in * 1000).getTime()));1000
    //     return  u.expires_in &&  Date() <=  u.expiration_date;
    // }
}