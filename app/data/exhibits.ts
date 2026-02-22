export interface ExhibitData {
  title: string;
  subtitle: string;
  image: string;
  content: string;
}

export const cardDataList: Record<string, ExhibitData> = {
  rektor: {
    title: 'UNIVERSITET REKTORI',
    subtitle: 'Prof. Dexkanov Suxrob',
    image: '/images/rektor.jpg',
    content: `Professor Dexkanov Suxrob Osiyo xalqaro universitetining rektori.

Beijing Language and Culture University (bakalavr) (2012-2016)
Herriot Watt University (magistr) Biznes administratsiya (MBA) (2020-2021)`,
  },
  umumtexnik: {
    title: '',
    subtitle: 'Umumtexnik fanlar kafedrasi',
    image: '/images/umumtexnik_logo.jpg',
    content: `Kafedrada 2 yo‘nalishlar bo‘yicha talabalar tahsil olib boriyapti:

– 60610100-Kompyuter ilmlari va dasturlash texnologiyalari (yo’nalishlar bo’yicha)

– 60721500-Konchilik ishi (faoliyat turlari bo’yicha)

Kafedrada mutaxasislik yo‘nalishlardan tashqari tabiiy (fizika) va aniq (matematika) fanlardan professor-o‘qituvchilar faoliyat olib bormoqda.`,
  },
  iqtisodiyot: {
    title: '',
    subtitle: 'Iqtisodiyot kafedrasi',
    image: '/images/umumtexnik_logo.jpg',
    content: `Kafedrada 2 yo‘nalishlar bo‘yicha talabalar tahsil olib boriyapti:

– 60610100-Kompyuter ilmlari va dasturlash texnologiyalari (yo’nalishlar bo’yicha)

– 60721500-Konchilik ishi (faoliyat turlari bo’yicha)

Kafedrada mutaxasislik yo‘nalishlardan tashqari tabiiy (fizika) va aniq (matematika) fanlardan professor-o‘qituvchilar faoliyat olib bormoqda.`,
  },
};
