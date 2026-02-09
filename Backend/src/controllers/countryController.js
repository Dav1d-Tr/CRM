import * as CountryService from "../services/countryService.js";

export const getAllCountrys = async (req, res) => {
  try {
    const Countrys = await CountryService.getAllCountrys();
    res.status(200).json(Countrys);
  } catch (err) {
    console.error("Error fetching Countrys:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCountryById = async (req, res) => {
  try {
    const CountryId = req.params.id;

    const Country = await CountryService.getCountryById(CountryId);

    if (!Country) {
      return res
        .status(404)
        .json({ message: "El Rol de usuario que busca no existe" });
    }

    res.status(200).json(Country);
  } catch (err) {
    console.error("Error al obtener el rol de usuario:", err);
    res.status(500).json({ message: "Error del Servidor" });
  }
};

export const createCountry = async (req, res) => {
  try {
    const CountryData = req.body;
    const newCountry = await CountryService.createCountry(CountryData);
    res.status(200).json(newCountry);
  } catch (err) {
    console.error("Error adding Country:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCountry = async (req, res) => {
  try {
    const CountryId = req.params.id;
    const CountryData = req.body;
    const updatedCountry = await CountryService.updateCountry(
      CountryId,
      CountryData
    );
    if (!updatedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json(updatedCountry);
  } catch (err) {
    console.error("Error updating Country:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCountry = async (req, res) => {
  try {
    const CountryId = req.params.id;
    const deleted = await CountryService.deleteCountry(CountryId);
    if (!deleted) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error deleting Country:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchCountry = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const Countrys = await CountryService.searchCountry(searchTerm);
    res.status(200).json(Countrys);
  } catch (error) {
    console.error("Error searching Countrys:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCountryStats = async (req, res) => {
  try {
    const data = await CountryService.getCustomerCountByCountry();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error obteniendo estadísticas de países" });
  }
};

export const getCustomerCountByCountry = async (req, res) => {
  try {
    const data = await countryService.getCustomerCountByCountry();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo estadísticas" });
  }
};
