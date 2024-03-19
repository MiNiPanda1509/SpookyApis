const pool = require( "../config/database");
require("dotenv").config();
const axios = require("axios");

async function getLatLong(locationName) {
    const apiKey = process.env.GOOGLEMAPAPIKEY;
    try {
        let __loc = locationName;
        let apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(__loc)}&key=${apiKey}`;

        let response = await axios.get(apiUrl);
        let data = response.data;

        if (data.status === 'OK') {
            const result = data.results[0];
            const { lat, lng } = result.geometry.location;
            return { latitude: lat, longitude: lng };
        } else {
            try {
                __loc = locationName.split('@')[0] + locationName.split('@')[1];
                apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(__loc)}&key=${apiKey}`;

                response = await axios.get(apiUrl);
                data = response.data;

                if (data.status === 'OK') {
                    const result = data.results[0];
                    const { lat, lng } = result.geometry.location;
                    return { latitude: lat, longitude: lng };
                } else {
                    console.error('Geocoding was not successful for the following reason:', data.status);
                    return { latitude: '', longitude: '' };
                }
            } catch (err) { return { latitude: '', longitude: ''}; }
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return { latitude: '', longitude: ''};
    }
}

function capitalizeString(inputString) {
    // Convert the first character to uppercase and the rest to lowercase
    let res = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
    // console.log(res)
    return res;
}

function  getInfo_(id){
        return new Promise((resolve, reject) => {

            pool.query(` select country, region, place from haunted_places where id=?`,
                [id],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
}

module.exports = {

    addPlace:  (country, region, place) => {
    return new Promise(async (resolve, reject) => {
        const location = country + " " + region + " " + place
        const { latitude, longitude, check } = await getLatLong(location);
        const outputData = [latitude, longitude]
        if (outputData[0] === '' || outputData[1] === '') // Place not found
            return reject('Invalid Place');

        pool.query(
            `insert into haunted_places(country, region, place) values(?,?,?)`,
            [
                capitalizeString(country),
                capitalizeString(region),
                capitalizeString(place)
            ],
            (err, result) => {
                if (err) {
                    reject(err);
                }

                const id = result.insertId;
                pool.query(
                    `insert into coords(id,lat, lng, place) values(?,?,?,?)`,
                    [
                        id,
                        Number(outputData[0]),
                        Number(outputData[1]),
                        capitalizeString(place)
                    ],
                    (err_sub, result_sub) => {
                        if (err_sub) {
                            reject(err_sub);
                        }
                        
                        pool.query(
                            `call Add_region_wise(?,?)`,
                            [
                                capitalizeString(country),
                                capitalizeString(region)
                            ],
                            (err_sub_sub, result_sub_sub) => {
                                const results = { "haunted_place": result, "coords": result_sub }
                                // Resolve with results
                                resolve(results);
                            }
                        )
                    }
                )
            }
        )
    })
},

    getLocationsByCoords: (bl_lat, tr_lat, bl_lng, tr_lng) => {
	return new Promise(async (resolve, reject) => {
	    
	    pool.query( `select country, region, coords.place, lat, lng, description \
        from haunted_places inner join coords on haunted_places.id = coords.id \
        left join story on haunted_places.id=story.id \
        where  ? <= lat and lat <= ? and ? <= lng and lng <= ? `,
	                [
	                    bl_lat,
                        tr_lat,
                        bl_lng,
                        tr_lng
	                ],
	                (err, results) => {
	                    if(err) reject(err);
	                    resolve(results)
	                }
	      )
	});
},
    
    getLocationsCountryWise:  (country) => {
    	return new Promise( async (resolve, reject) => {
    	    
    	    pool.query(`select region, c.place, lat, lng \
    	                from haunted_places as h inner join coords as c on h.id = c.id \
    	                where  h.country=?`,
    	                [
    	                    capitalizeString(country)
    	                ],
    	                (err, results) => {
    	                    if(err) reject(err);
    	                    resolve(results)
    	                }
    	      )
    	})
    },
    
    getRankListCountryWise:  () => {
    	return new Promise((resolve, reject) => {
    	    
    	    pool.query(  `select country, count(*) as count \
            from haunted_places group by country order by count desc`,
    	                [],
    	                (err, results) => {
    	                    if(err) reject(err);
    	                    resolve(results)
    	                }
    	      )
    	})
    },
        
   getInfo: (id) => {
        return new Promise((resolve, reject) => {

            pool.query(` select country, region, place from haunted_places where id=?`,
                [id],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },
    
 
    updateInfo_: (_id, _country, _region, _place, country, region, place) => {

    return new Promise(async (resolve, reject) => {
            
            const location = (country !== "" ? country : _country) + " " +
                             (region !== "" ? region : _region) + " " +
                             (place !== "" ? place : _place)
            
         
            const { latitude, longitude } = await getLatLong(location);
            const outputData = [latitude, longitude]
    
            if (outputData[0] === '' || outputData[1] === '') // Place not found
                return reject('Invalid Place');
    
            pool.query(
                `update haunted_places set country=?, region=?, place=? where id=?`,
                [
                    capitalizeString(country ? country : _country),
                    capitalizeString(region ? region : _region),
                    capitalizeString(place ? place : _place),
                    _id
                ],
                (err, result) => {
                    if (err) {
                        reject(err);
                    }
    
    
                    pool.query(
                        `update coords set lat=?, lng=?, place=? where id=?`,
                        [
                            Number(outputData[0]),
                            Number(outputData[1]),
                            capitalizeString(place ? place : _place),
                            _id
                        ],
                        (err_sub, result_sub) => {
                            if (err_sub) {
                                reject(err_sub);
                            }
                            pool.query(
                                `call Update_region_wise(?,?,?,?)`,
                                [
                                    _country, //old country
                                    _region, //old region
                                    capitalizeString(country ? country : _country), //updated country (if at all updated)
                                    capitalizeString(region ? region : _region), //updated region (if at all updated)
                                ],
                                (err_sub_sub, result_sub_sub) => {
                                    const results = { "haunted_place": result, "coords": result_sub }
                                    // Resolve with results
                                    resolve(results);
                                }
                            )
                        }
                    )
                }
            )
        })
    },
    
    deleteInfo: (id) => {

    return new Promise(async (resolve, reject) => {

            pool.query(
                `call Delete_region_wise(?)`,
                [
                    id
                ],
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
    
                    pool.query(
                        ` delete from haunted_places where id=?`,
                        [
                            id
                        ],
                        (err, result) => {
                            if (err) {
                                reject(err);
                            }
    
                            pool.query(
                                `delete from coords where id=?`,
                                [
                                    id
                                ],
                                (err_sub, result_sub) => {
                                    if (err_sub) {
                                        reject(err_sub);
                                    }
                                    const results = { "haunted_place": result, "coords": result_sub }
                                    // Resolve with results
                                    resolve(results);
                                }
    
                            )
                        }
                    )
                }
            )
        })
    },
    
    getLocationsRegionWise:  (region) => {
        return new Promise(async (resolve, reject) => {

            pool.query(`select c.place, lat, lng \
            from haunted_places as h inner join coords as c on h.id = c.id \
            where  h.region=?`,
                [
                    capitalizeString(region)
                ],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },
    
    getRankListRegionWiseCountryWise:  () => {
        return new Promise(async (resolve, reject) => {

            pool.query( `select country, region, count(*) as count \
            from haunted_places group by country, region order by count desc`,
            [],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },
    
    getTopRegionCountryWise:  () => {
        return new Promise(async (resolve, reject) => {

            pool.query( `select country, region, total_count from region_wise as o \
            where total_count >= ALL(select total_count from region_wise where country = o.country);`,
             [],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },
    
    getLowestRegionCountryWise:  () => {
        return new Promise(async (resolve, reject) => {

            pool.query( `select country, region, total_count from region_wise as o \
            where total_count <= ALL(select total_count from region_wise where country = o.country);`,
           [],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },

    searchTextInEntireTable:  (text) => {
        return new Promise(async (resolve, reject) => {
            const search = `%${text.toLowerCase()}%` 
            pool.query(  `select * from haunted_places where lower(country) like ? or lower(region) like ? or lower(place) like ?`,
            [
                search, 
                search, 
                search
            ],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },

    getRegionsWithAtleastXPlaces:  (count) => {
        return new Promise(async (resolve, reject) => {
            pool.query(  `select country, region, total_count from region_wise where total_count >= ? order by total_count desc;`,
            [
                count
            ],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results)
                }
            )
        })
    },
    
}