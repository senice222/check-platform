export interface IAdmin {
    id: string;
    name: string;
    login: string;
    password: string;
    isSuperAdmin: boolean;
    createdAt: string;
}

export interface IAdminResponse {
    admin: IAdmin;
    token: string;
}

export interface IAdminCreateData {
    name: string;
    login: string;
    password: string;
} 