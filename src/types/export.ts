export interface ExportData {
    id: string;
    date: string;
    client: string;
    company: string;
    seller: string;
    sum: string;
    status: string;
}

export interface ExportResponse {
    data: ExportData[];
    total: number;
} 