import * as CityService from "../services/cityService.js";

export const getAllCitys = async (req, res) => {
  try {
    const { countryId } = req.query;

    if (countryId) {
      const cities = await CityService.getCitiesByCountry(countryId);
      return res.status(200).json(cities);
    }

    const cities = await CityService.getAllCitys();
    res.status(200).json(cities);

  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCityById = async (req, res) => {
  try {
    const CityId = req.params.id;

    const City = await CityService.getCityById(CityId);

    if (!City) {
      return res.status(404).json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(City);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const createCity = async (req, res) => {
    try {
        const CityData = req.body;
        const newCity = await CityService.createCity(CityData);
        res.status(200).json(newCity);
    } catch (err) { 
        console.error('Error adding City:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateCity = async (req, res) => {
    try {
        const CityId = req.params.id;
        const CityData = req.body;
        const updatedCity = await CityService.updateCity(CityId, CityData);
        if (!updatedCity) {
            return res.status(404).json({ message: 'City not found' });
        }
        res.status(200).json(updatedCity);

    } catch (err) { 
        console.error('Error updating City:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteCity = async (req, res) => {
    try {
        const CityId = req.params.id;
        const deleted = await CityService.deleteCity(CityId);
        if (!deleted) {
        return res.status(404).json({ message: 'City not found' });
        }

        res.status(200).send();

    } catch (err) { 
        console.error('Error deleting City:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const searchCity = async (req, res) => {
    try {
      const searchTerm = req.query.q;
      const Citys = await CityService.searchCity(searchTerm);
      res.status(200).json(Citys);
    } catch (error) {
      console.error('Error searching Citys:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

