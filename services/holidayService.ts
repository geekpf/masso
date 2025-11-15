const holidays2024: { date: string; name: string }[] = [
    { date: '2024-01-01', name: 'Confraternização Universal' },
    { date: '2024-02-12', name: 'Carnaval' },
    { date: '2024-02-13', name: 'Carnaval' },
    { date: '2024-03-29', name: 'Paixão de Cristo' },
    { date: '2024-04-21', name: 'Tiradentes' },
    { date: '2024-05-01', name: 'Dia do Trabalho' },
    { date: '2024-05-30', name: 'Corpus Christi' },
    { date: '2024-09-07', name: 'Independência do Brasil' },
    { date: '2024-10-12', name: 'Nossa Senhora Aparecida' },
    { date: '2024-11-02', name: 'Finados' },
    { date: '2024-11-15', name: 'Proclamação da República' },
    { date: '2024-11-20', name: 'Dia da Consciência Negra' },
    { date: '2024-12-25', name: 'Natal' },
];

// In a real application, you might fetch this from an API
export const getHolidays = (year: number): Map<string, string> => {
    // For now, it only supports 2024
    if (year === 2024) {
        const holidayMap = new Map<string, string>();
        holidays2024.forEach(holiday => {
            holidayMap.set(holiday.date, holiday.name);
        });
        return holidayMap;
    }
    return new Map<string, string>();
};
