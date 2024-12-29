import { TableData } from '../components/active-applications/active-applications';

export const companyApplicationsData: TableData[] = [
  { 
    id: "#01", 
    statuses: ["created", "issued"],
    company: "ООО Компания 1",
    seller: "Продавец 1",
    checksCount: 5,
    client: {
      id: "1",
      name: "Евгений",
      inn: "1234567890"
    },
    sum: "100 000 ₽",
    date: {
      start: "01.12.24",
      end: "31.12.24"
    }
  },
  { 
    id: "#02", 
    statuses: ["client_paid"],
    company: "ООО Компания 1",
    seller: "Продавец 2",
    checksCount: 3,
    client: {
      id: "2",
      name: "Александр",
      inn: "9876543210"
    },
    sum: "150 000 ₽",
    date: {
      start: "15.12.24",
      end: "25.12.24"
    }
  },
  { 
    id: "#03", 
    statuses: ["us_paid"],
    company: "ООО Компания 1",
    seller: "Продавец 1",
    checksCount: 7,
    client: {
      id: "3",
      name: "Михаил",
      inn: "5678901234"
    },
    sum: "200 000 ₽",
    date: {
      start: "10.12.24",
      end: "20.12.24"
    }
  },
  { 
    id: "#04", 
    statuses: ["created"],
    company: "ООО Компания 1",
    seller: "Продавец 3",
    checksCount: 2,
    client: {
      id: "4",
      name: "Дмитрий",
      inn: "3456789012"
    },
    sum: "80 000 ₽",
    date: {
      start: "05.12.24",
      end: "15.12.24"
    }
  },
]; 