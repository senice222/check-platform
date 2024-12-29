export interface CheckData {
  id: string;
  date: string;
  company: {
    name: string;
    inn: string;
  };
  seller: {
    name: string;
    inn: string;
    isElite?: boolean;
  };
  product: string;
  unit: string;
  quantity: string;
  priceForOne: string;
  fullPrice: string;
  vat: string;
}

export const companyChecksData: CheckData[] = [
  {
    id: "#01",
    date: "25/10/24",
    company: {
      name: "ООО Компания 1",
      inn: "987654321"
    },
    seller: {
      name: "ООО 'Инновации 2023'",
      inn: "123456789",
      isElite: true
    },
    product: "Игровая мышь",
    unit: "шт.",
    quantity: "1.000",
    priceForOne: "91,316.00",
    fullPrice: "91,316.00",
    vat: "91,316.00"
  },
  {
    id: "#02",
    date: "26/10/24",
    company: {
      name: "ООО Компания 1",
      inn: "987654321"
    },
    seller: {
      name: "ООО 'Технологии Плюс'",
      inn: "567890123",
      isElite: false
    },
    product: "Клавиатура механическая",
    unit: "шт.",
    quantity: "2.000",
    priceForOne: "45,500.00",
    fullPrice: "91,000.00",
    vat: "91,000.00"
  },
  {
    id: "#03",
    date: "27/10/24",
    company: {
      name: "ООО Компания 1",
      inn: "987654321"
    },
    seller: {
      name: "ООО 'Инновации 2023'",
      inn: "123456789",
      isElite: true
    },
    product: "Монитор 27\"",
    unit: "шт.",
    quantity: "1.000",
    priceForOne: "150,000.00",
    fullPrice: "150,000.00",
    vat: "150,000.00"
  },
  {
    id: "#04",
    date: "28/10/24",
    company: {
      name: "ООО Компания 1",
      inn: "987654321"
    },
    seller: {
      name: "ООО 'Электроника PRO'",
      inn: "345678901",
      isElite: false
    },
    product: "Наушники беспроводные",
    unit: "шт.",
    quantity: "3.000",
    priceForOne: "25,000.00",
    fullPrice: "75,000.00",
    vat: "75,000.00"
  },
  {
    id: "#05",
    date: "29/10/24",
    company: {
      name: "ООО Компания 1",
      inn: "987654321"
    },
    seller: {
      name: "ООО 'Технологии Плюс'",
      inn: "567890123",
      isElite: false
    },
    product: "Веб-камера HD",
    unit: "шт.",
    quantity: "2.000",
    priceForOne: "35,000.00",
    fullPrice: "70,000.00",
    vat: "70,000.00"
  }
]; 