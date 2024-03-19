const {addPlace, getLocationsByCoords, getLocationsCountryWise,
    getRankListCountryWise, updateInfo_, getInfo, deleteInfo,
    getLocationsRegionWise, getRankListRegionWiseCountryWise,
    getTopRegionCountryWise, getLowestRegionCountryWise, searchTextInEntireTable,
    getRegionsWithAtleastXPlaces} = require ("./places.service")

module.exports = {

    addNewPlace: async (req, res) => { 

        try {
            const response = await addPlace(req.query.country, req.query.region, req.query.place);
            return res.status(200).json({
                success: 1,
                data: response
            });
    
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            });
        }
    },

    getLocationsByBoundary: async (req, res) => {

        try {
            const response = await getLocationsByCoords(req.query.bl_lat, req.query.tr_lat, req.query.bl_lng, req.query.tr_lng);
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
    
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },

    getLocationsByCountry: async (req, res) => {

        try {
            const country = req.query.val;
            const response = await getLocationsCountryWise(country);
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    getRankListByCountry: async (req, res) => {
    
        try {
            const response = await getRankListCountryWise();
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    getInfoById: async (req, res) => {
    
        try {
            const id = req.params.id
            const response = await getInfo(id);
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    updateInfo: async (req, res) => {

    try {
         
            if(!req.query.id){
                return res.status(500).json({
                    success: 0,
                    message: "Id is mandatory!"
                })
            }
            
            const result  = await getInfo(req.query.id);
            const {country, region, place} = result[0]
            
            const country_new = req.query.country ? req.query.country : ""
            const region_new = req.query.region ? req.query.region : ""
            const place_new = req.query.place ? req.query.place : ""
    
            const response = await updateInfo_(req.query.id, country, region, place,
                                              country_new, region_new, place_new);
           
            return res.status(200).json({
                success: 1,
                data: response
            })
    
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    deleteInfoById: async (req, res) => {
    
        try {
            const id = req.params.id
            const response = await deleteInfo(id);
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    getLocationsByRegion: async (req, res) => {
    
        try {
            
            const region = req.query.val;
            const response = await getLocationsRegionWise(region);
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    getRankListByRegionInCountry: async (req, res) => {
        console.log(req)
        try {
            const response = await getRankListRegionWiseCountryWise();
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    getTopRegionInCountry: async (req, res) => {
    
        try {
            const response = await getTopRegionCountryWise();
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    getLowestRegionInCountry: async (req, res) => {
    
        try {
            const response = await getLowestRegionCountryWise();
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
    
    searchTextInTable: async (req, res) => {
    
        try {
            const text = req.query.key;
            const response = await searchTextInEntireTable(text);
            // console.log(response)
            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },

    getRegionInCountryWithAtleastXCount: async (req, res) => {
    
        try {
            const count = req.query.count;

            const response = await getRegionsWithAtleastXPlaces(count);

            return res.status(200).json({
                success: 1,
                data: response
            })
        } catch (err) {
            return res.status(500).json({
                success: 0,
                message: err
            })
        }
    },
};