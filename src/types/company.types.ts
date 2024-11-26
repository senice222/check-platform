export interface Company {
  name: string;
  inn: string;
  type: 'standart' | 'elit';
}

export interface ApplicationInfo {
  seller: {
    companyName: string;
    inn: string;
  };
  buyer: Company;
  commission: {
    percentage: string;
    amount: string;
  };
} 