const {addNewPlace, getLocationsByBoundary, getLocationsByCountry,
        getRankListByCountry, updateInfo,getInfoById, deleteInfoById,
        getLocationsByRegion, getRankListByRegionInCountry, getTopRegionInCountry,
        getLowestRegionInCountry, searchTextInTable, getRegionInCountryWithAtleastXCount} = require("./places.controller")
const router = require("express").Router();

router.post("/", addNewPlace)
router.patch("/", updateInfo)
router.get("/list-in-boundary", getLocationsByBoundary)
router.get("/list-in-country", getLocationsByCountry)
router.get("/list-in-region", getLocationsByRegion)
router.get("/rankByCountry", getRankListByCountry)
router.get("/rankByRegionInCountry", getRankListByRegionInCountry)
router.get("/searchText", searchTextInTable)
router.get("/topRegionInCountry", getTopRegionInCountry)
router.get("/lowestRegionInCountry", getLowestRegionInCountry)
router.get("/placesCountByRegion", getRegionInCountryWithAtleastXCount)
router.get("/:id", getInfoById)
router.delete("/:id", deleteInfoById)


module.exports = router;