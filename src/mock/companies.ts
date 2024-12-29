interface Company {
  id: string;
  name: string;
  inn: string;
  applications: {
    id: string;
    statuses: string[];
    seller: string;
    checksCount: number;
    client: {
      id: string;
      name: string;
      inn: string;
    };
    sum: string;
    date: {
      start: string;
      end: string;
    };
  }[];
  activeApplications?: number;
  totalApplications?: number;
}

export const companiesData: Company[] = [
  {
    id: "1",
    name: "ООО Компания 1",
    inn: "7731347089",
    applications: [
      {
        id: "#01",
        statuses: ["created", "issued"],
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
      }
    ]
  },
  {
    id: "2",
    name: "ООО Компания 2",
    inn: "7703408188",
    applications: [
      {
        id: "#03",
        statuses: ["us_paid"],
        seller: "Продавец 3",
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
      }
    ]
  },
  {
    id: "3",
    name: "ООО Компания 3",
    inn: "7702408188",
    applications: [
      {
        id: "#04",
        statuses: ["created"],
        seller: "Продавец 4",
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
      }
    ]
  },
  {
    id: "4",
    name: "ООО Компания 4",
    inn: "7702408189",
    applications: [
      {
        id: "#05",
        statuses: ["created"],
        seller: "Продавец 5",
        checksCount: 4,
        client: {
          id: "5",
          name: "Анна",
          inn: "3456789013"
        },
        sum: "120 000 ₽",
        date: {
          start: "07.12.24",
          end: "17.12.24"
        }
      },
      {
        id: "#06",
        statuses: ["us_paid"],
        seller: "Продавец 5",
        checksCount: 3,
        client: {
          id: "5",
          name: "Анна",
          inn: "3456789013"
        },
        sum: "90 000 ₽",
        date: {
          start: "01.12.24",
          end: "10.12.24"
        }
      }
    ]
  },
  {
    id: "5",
    name: "ООО Компания 5",
    inn: "7702408190",
    applications: [
      {
        id: "#07",
        statuses: ["created", "issued"],
        seller: "Продавец 6",
        checksCount: 6,
        client: {
          id: "6",
          name: "Сергей",
          inn: "3456789014"
        },
        sum: "180 000 ₽",
        date: {
          start: "03.12.24",
          end: "13.12.24"
        }
      },
      {
        id: "#08",
        statuses: ["us_paid"],
        seller: "Продавец 6",
        checksCount: 2,
        client: {
          id: "6",
          name: "Сергей",
          inn: "3456789014"
        },
        sum: "70 000 ₽",
        date: {
          start: "01.12.24",
          end: "10.12.24"
        }
      },
      {
        id: "#09",
        statuses: ["client_paid"],
        seller: "Продавец 6",
        checksCount: 3,
        client: {
          id: "6",
          name: "Сергей",
          inn: "3456789014"
        },
        sum: "95 000 ₽",
        date: {
          start: "05.12.24",
          end: "15.12.24"
        }
      }
    ]
  }
].map(company => ({
  ...company,
  activeApplications: company.applications.filter(app => !app.statuses.includes('us_paid')).length,
  totalApplications: company.applications.length
})); 