const http = require('http');

var motogp = [
    {
        circuit: 'Losail',
        location: 'Qatar',
        winner: {
            firstName: 'Andrea',
            lastName: 'Dovizioso',
            country: 'Italy'
        }
    },
    {
        circuit: 'Autodromo',
        location: 'Argentine',
        winner: {
            firstName: 'Cal',
            lastName: 'Crutchlow',
            country: 'UK'
        }
    },
    {
        circuit: 'De Jerez',
        location: 'Spain',
        winner: {
            firstName: 'Valentino',
            lastName: 'Rossi',
            country: 'Italy'
        }
    },
    {
        circuit: 'Mugello',
        location: 'Italy',
        winner: {
            firstName: 'Andrea',
            lastName: 'Dovizioso',
            country: 'Italy'
        }
    }
];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    
    if (req.url === '/') {
        res.write('<html><head><title>MotoGP Data</title></head><body><h1>Data MotoGP</h1><ul>');
        motogp.forEach(race => {
            res.write(`<li>${race.circuit}, ${race.location} - ${race.winner.firstName} ${race.winner.lastName} (${race.winner.country})</li>`);
        });
        res.write('</ul></body></html>');
        res.end();
    } else if (req.url === '/country') {
        let groupedByCountry = motogp.reduce((acc, race) => {
            let country = race.winner.country;
            if (!acc[country]) {
                acc[country] = {
                    winningCircuits: [],
                    totalWin: 0
                };
            }
            acc[country].winningCircuits.push({
                name: race.winner.firstName + ' ' + race.winner.lastName,
                winLocation: race.circuit + ', ' + race.location
            });
            acc[country].totalWin++;
            return acc;
        }, {});
        
        res.write('<html><head><title>MotoGP Data by Country</title></head><body><h1>Data MotoGP Berdasarkan Negara</h1>');
        for (let country in groupedByCountry) {
            res.write(`<h2>${country}</h2><ul>`);
            groupedByCountry[country].winningCircuits.forEach(race => {
                res.write(`<li>${race.name}, menang di ${race.winLocation}</li>`);
            });
            res.write(`</ul><p>Total kemenangan: ${groupedByCountry[country].totalWin}</p>`);
        }
        res.write('</body></html>');
        res.end();
    } else if (req.url === '/name') {
        let groupedByName = motogp.reduce((acc, race) => {
            let name = race.winner.firstName + ' ' + race.winner.lastName;
            if (!acc[name]) {
                acc[name] = [];
            }
            acc[name].push(`${race.circuit}, ${race.location}`);
            return acc;
        }, {});
        
        res.write('<html><head><title>MotoGP Data by Name</title></head><body><h1>Data MotoGP Berdasarkan Nama Pemenang</h1>');
        for (let name in groupedByName) {
            res.write(`<h2>${name}</h2><ul>`);
            groupedByName[name].forEach(location => {
                res.write(`<li>Menang di ${location}</li>`);
            });
            res.write('</ul>');
        }
        res.write('</body></html>');
        res.end();
    } else {
        res.write('<html><head><title>Bad Request</title></head><body><h1>Bad Request</h1></body></html>');
        res.end();
    }
});

server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
