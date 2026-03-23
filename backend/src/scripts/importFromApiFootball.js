import 'dotenv/config';
import https from 'https';
import { db } from '../firebase/firebaseAdmin.js';

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_HOST = 'v3.football.api-sports.io';
const SEASON = '2024';

const RATE_LIMIT_DELAY_MS = 7000;

const LEAGUES = [
    { id: 39, name: 'Premier League' },
    { id: 140, name: 'La Liga' },
    { id: 135, name: 'Serie A' },
    { id: 78, name: 'Bundesliga' },
    { id: 61, name: 'Ligue 1' },
];

const POPULAR_PLAYERS = [
    { search: 'Messi', leagueId: 253, leagueName: 'MLS' },
    { search: 'Ronaldo', leagueId: 307, leagueName: 'Saudi League' },
    { search: 'Vinicius', leagueId: 140, leagueName: 'La Liga' },
    { search: 'Pedri', leagueId: 140, leagueName: 'La Liga' },
    { search: 'Bellingham', leagueId: 140, leagueName: 'La Liga' },
    { search: 'Saka', leagueId: 39, leagueName: 'Premier League' },
    { search: 'Salah', leagueId: 39, leagueName: 'Premier League' },
    { search: 'De Bruyne', leagueId: 39, leagueName: 'Premier League' },
    { search: 'van Dijk', leagueId: 39, leagueName: 'Premier League' },
    { search: 'Alisson', leagueId: 39, leagueName: 'Premier League' },
    { search: 'Courtois', leagueId: 140, leagueName: 'La Liga' },
    { search: 'Ter Stegen', leagueId: 140, leagueName: 'La Liga' },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchFromApi = (path) =>
    new Promise((resolve, reject) => {
        if (!API_KEY) {
            reject(new Error('API_FOOTBALL_KEY is not set in your .env file.'));
            return;
        }

        const options = {
            hostname: API_HOST,
            path,
            method: 'GET',
            headers: { 'x-apisports-key': API_KEY },
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error('JSON parse failed: ' + e.message));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });

const mapPlayer = (entry, leagueName) => {
    const p = entry.player;
    const stats = entry.statistics?.[0] || {};

    const name = p.name || 'Unknown';
    const club = stats.team?.name || 'Unknown';
    const nationality = p.nationality || 'Unknown';
    const position = stats.games?.position || 'Unknown';

    const nameParts = name.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : name;

    return {
        apiFootballId: p.id,
        name,
        club,
        nationality,
        position,
        age: p.age || null,
        photoUrl: p.photo || null,
        league: leagueName,
        nameLower: name.toLowerCase(),
        lastNameLower: lastName.toLowerCase(),
        clubLower: club.toLowerCase(),
        nationalityLower: nationality.toLowerCase(),
        createdAt: new Date().toISOString(),
    };
};

const writeToFirestore = async (playerMap) => {
    const players = Array.from(playerMap.values());
    if (!players.length) {
        console.log('Nothing to write.');
        return 0;
    }

    console.log('\nWriting to Firestore...');

    const BATCH_SIZE = 499;
    let batch = db.batch();
    let batchCount = 0;
    let totalWritten = 0;

    for (const player of players) {
        const docId = 'apf_' + player.apiFootballId;
        const docRef = db.collection('footballers').doc(docId);
        batch.set(docRef, { id: docId, ...player });
        batchCount++;
        totalWritten++;

        if (batchCount === BATCH_SIZE) {
            await batch.commit();
            console.log('  Committed batch of ' + batchCount);
            batch = db.batch();
            batchCount = 0;
        }
    }

    if (batchCount > 0) {
        await batch.commit();
        console.log('  Committed final batch of ' + batchCount);
    }

    return totalWritten;
};

const run = async () => {
    console.log('Starting API-Football import...');
    console.log('(7s delay between each API call to respect rate limit)\n');

    const playerMap = new Map();

    console.log('── Step 1: Top scorers from major leagues ──');

    for (const league of LEAGUES) {
        console.log('  Fetching ' + league.name + '...');
        try {
            const data = await fetchFromApi(
                '/players/topscorers?league=' + league.id + '&season=' + SEASON
            );

            if (data.errors && Object.keys(data.errors).length > 0) {
                console.error('  API error: ' + JSON.stringify(data.errors));
                continue;
            }

            const entries = data.response || [];
            let added = 0;
            for (const entry of entries) {
                const pid = entry.player?.id;
                if (!pid || playerMap.has(pid)) continue;
                playerMap.set(pid, mapPlayer(entry, league.name));
                added++;
            }
            console.log('  → ' + entries.length + ' returned, ' + added + ' new');
        } catch (err) {
            console.error('  Failed: ' + err.message);
        }

        await delay(RATE_LIMIT_DELAY_MS);
    }

    console.log('\n── Step 2: Popular players by name search ──');

    for (const popular of POPULAR_PLAYERS) {
        console.log('  Searching "' + popular.search + '" in ' + popular.leagueName + '...');
        try {
            const data = await fetchFromApi(
                '/players?search=' + encodeURIComponent(popular.search) +
                '&league=' + popular.leagueId +
                '&season=' + SEASON
            );

            if (data.errors && Object.keys(data.errors).length > 0) {
                console.error('  API error: ' + JSON.stringify(data.errors));
                await delay(RATE_LIMIT_DELAY_MS);
                continue;
            }

            const entries = data.response || [];
            if (!entries.length) {
                console.log('  → No results found');
                await delay(RATE_LIMIT_DELAY_MS);
                continue;
            }

            const entry = entries[0];
            const pid = entry.player?.id;

            if (playerMap.has(pid)) {
                console.log('  → ' + entry.player.name + ' already in set, skipping');
            } else {
                const mapped = mapPlayer(entry, popular.leagueName);
                playerMap.set(pid, mapped);
                console.log('  → Added: ' + mapped.name + ' (' + mapped.club + ')');
            }
        } catch (err) {
            console.error('  Failed: ' + err.message);
        }

        await delay(RATE_LIMIT_DELAY_MS);
    }

    console.log('\nTotal unique players: ' + playerMap.size);
    const written = await writeToFirestore(playerMap);
    console.log('\n✓ Done. ' + written + ' footballers written to Firestore.');
    process.exit(0);
};

run().catch((err) => {
    console.error('\nImport failed:', err.message);
    process.exit(1);
});