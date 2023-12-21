import { AuthTokenModel } from "./authtokenmodel";

export interface LoginModel {
    username: string;
    password: string;
    AuthTokenModel: AuthTokenModel;
    role: string[];
}
