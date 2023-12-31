import type { CfProperties } from "@cloudflare/workers-types";
import cities from "../data/city.json";

// const SERVICE_URL = "https://api.myquran.com/v1/sholat/kota";
// Fallback city if user not from Indonesia or can't detect city
const fallbackCity = {
	id: "1301",
	lokasi: "Jakarta",
};

/**
 * Get all cities
 */
function getCities() {
	// return fetch(`${SERVICE_URL}/semua`).then((r) => r.json());

	// Use local data, instead of fetch from API to reduce API call
	return cities;
}

/**
 * Get city by user location
 */
export function getCityByUser(cf?: CfProperties) {
	// TS can't detect type of cf?.city after we check that, so we need to assign it to variable first
	const cfCity = cf?.city;

	// If user not from Indonesia, use Jakarta as default
	// If user from Indonesia, but can't detect city, use Jakarta as default
	if (!cf || typeof cfCity !== "string" || cf?.country !== "ID") {
		return fallbackCity;
	}

	const userCity = getCities().find((city) =>
		// Use regex to match city name, case insensitive
		new RegExp(cfCity, "i").test(city.lokasi)
	);

	// If user from Indonesia, but can't find city, use Jakarta as default
	if (!userCity) {
		return fallbackCity;
	}

	return userCity;
}
