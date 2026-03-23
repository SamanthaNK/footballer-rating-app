import * as footballerService from '../services/footballerService.js';

const handle = (fn) => async (req, res) => {
    try {
        const result = await fn(req, res);
        const { _status, ...data } = result;
        return res.status(_status || 200).json(data);
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'An unexpected error occurred.',
        });
    }
};

export const getFootballers = handle(async (req) => {
    const limit = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor || null;
    return footballerService.getFootballers({ limit, cursor });
});

export const searchFootballers = handle(async (req) => {
    const { q, position, club, nationality } = req.query;
    if (!q && !position && !club && !nationality) {
        const err = new Error('Provide at least one search term: q, position, club, or nationality.');
        err.status = 400;
        throw err;
    }
    return footballerService.searchFootballers({ q, position, club, nationality });
});

export const getFootballerById = handle(async (req) => {
    const { id } = req.params;
    return footballerService.getFootballerById({ id });
});

export const getLeaderboard = handle(async () => {
    return footballerService.getLeaderboard();
});