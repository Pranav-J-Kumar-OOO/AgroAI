import requests
import json

api_key= '.'

ids_ = {
  "+919944312005":{
    "no":"+919944312005",
    "loc":[10,78.5]
  }
}

def get_soil_data(lat, lon):
    base_url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    params = {
        "lat": lat,
        "lon": lon,
    }

    try:
        response = requests.get(base_url, params=params)
        response_data = response.json()
        return response_data
    except Exception as e:
        print(f"Error fetching soil data: {e}")
        return None

def get_groundwater_amount(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(url)
    data = response.json()
    
    # Extract the groundwater amount from the response
    groundwater_amount = data.get('ground_level', {}).get('value', None)
    
    return groundwater_amount
    
    
for i in ids_.values():
    print(i)
    total_data = get_soil_data(i["loc"][0], i["loc"][1])
    ground_water_data = get_groundwater_amount(i["loc"][0], i["loc"][1])

    total_data["ground_water_data"] = ground_water_data
    # Save the data to a JSON file
    output_filename = f"{i["no"]}_ground_data.json"
    with open(output_filename, "w") as json_file:
        json.dump(total_data, json_file, indent=2)

    print(f"Soil data saved to {output_filename}")