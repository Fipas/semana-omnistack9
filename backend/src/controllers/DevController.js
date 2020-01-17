const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, update, destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const githubResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login, avatar_url, bio } = githubResponse.data;
            const techsArray = parseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
        
    
        return response.json(dev);
    },

    async update(request, response) {
        const { id } = request.params;
        const dev = await Dev.findOne({ '_id': id });
        const { name = dev.name, 
                techs = null, 
                latitude = dev.latitude, 
                longitude = dev.longitude, 
                avatar_url = dev.avatar_url, 
                bio = dev.bio } = request.body;

        let techsArray = null;
        let location = null;

        if (latitude && longitude) {
            location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        } else {
            location = dev.location;
        }

        if (!techs) { 
            techsArray = dev.techs;
        } else { 
            techsArray = parseStringAsArray(techs);
        }
            
        if (dev) {
            const status = await Dev.updateOne({ '_id': id}, { $set: {
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            }});
            return response.json(status);
        }
    },

    async destroy(request, response) {
        const { id } = request.params;
        const { ok, deletedCount } = await Dev.deleteOne({ '_id': id });
        return response.json({ ok, deletedCount });
    }
}