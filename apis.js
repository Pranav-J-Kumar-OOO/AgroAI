import admin from 'firebase-admin';
import https from 'https';
import querystring from 'querystring';
import fetch from 'node-fetch';
import { parse } from 'path';
import OpenAI from 'openai';
import fs from 'fs/promises';
import { read } from 'fs';

let currentWeatherData;
let weatherForecastData;
var soil_;
var nitro;
var clay;
var sand;
var silt;
var soil_req;
var additional_info;

const ids_ = {
  "+919944312005":{
    "no":"+919944312005",
    "loc":[9.9,78.1]
  }
};
const ids = ["+919944312005"];

var lat = 9.89000000; // Tambaram, Tamil Nadu, India
var lon = 78.03000000;

const openai = new OpenAI({
  apiKey: 'sk-None-R0lBMGoqXiWhtaPP9q8dT3BlbkFJqV6BjHUFYG7MlaP2LE1f',
});

admin.initializeApp({
  credential: admin.credential.cert('database-key.json'),
  databaseURL: 'https://agroai-7572f-default-rtdb.asia-southeast1.firebasedatabase.app',
});
const db = admin.database();

const apiKey = 'a0ec12bd9f134b7ca3102800232007';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

var url;
const months = ["January", "February", "March", "April", "May","June","July","August","September","October","November","December"];

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
  try {
      const response = await fetch(url);
      if (response.ok) {
          currentWeatherData = response.json();
          return await response.json();
      }
  } catch (error) {
      console.error('Error:', error);
  }
  return null;
}

async function getWeatherForecast(latitude, longitude) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7`;
  try {
      const response = await fetch(url);
      if (response.ok) {
          weatherForecastData = response.json();
          return await response.json();
      }
  } catch (error) {
      console.error('Error:', error);
  }
  return null;
}

function get_month()
{
    var month = new Date().getMonth();
    return months[parseInt(month)-1] 
}


async function main(file_id)
{
  var loc = ids_[file_id]["loc"];

  lat = loc[0];
  lon = loc[1];
  const params = querystring.stringify({
    lat: loc[0],
    lon: loc[1],
    units: 'metric',
    appid: apiKey
  });
  url = baseUrl + '?' + params

  await getCurrentWeather(lat, lon);
  await getWeatherForecast(lat, lon);

  console.log('Current Weather:', currentWeatherData);
  console.log('Weather Forecast:', weatherForecastData);
  await read_soil(file_id);
  await ai(file_id);

}
async function read_soil(file_id) {
  try {
      const data = await fs.readFile(`${file_id}_ground_data.json`, 'utf8');
      soil_ = JSON.parse(data);
      clay = JSON.stringify(soil_.properties.layers[3]);
      nitro = JSON.stringify(soil_.properties.layers[4]);
      sand = JSON.stringify(soil_.properties.layers[8]);
      silt = JSON.stringify(soil_.properties.layers[9]);
      additional_info = JSON.stringify(soil_.additional_info);
      soil_req = [clay, nitro, sand, silt];
  } catch (error) {
      console.error('Error reading file:', error);
  }
}
async function ai(file_id) {

  let full_prompt=`Lattitude: ${lat},Longitude: ${lon},${currentWeatherData}, Soil data: ${soil_req},
  Forecast for next week:${weatherForecastData},month:${get_month()}, Additional info: ${additional_info}`;

  let system_prompt="You are a farming assitant. The user will provide THE LOCATION, weather, temperature,soildata as a dictionary, weather forecast for the next week, current month. You have to provide the crop suggestions of 400 words , Nutrition/manure/fertilizer suggestions of 400 words, Crop rotation patter for the upcoming season of 400 words, mixed cropping crop suggestion of 400 words, Harvest time for each crop suggested of 400 words. Dont give any warnings and mentions of asking suggestions to a agriculture expert or consult a local agricultural advisories as It is aldready prompted many times to the user aldready.Give the data as per the number of words prompted previously. Important: Make sure to take note of the given additional info and give data based on it";

  console.log(full_prompt)
  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", content: system_prompt+". Give the data without any double qoutes or any bolding s or italics as it will be text to speached",
      },
      {
        role: "user", content: full_prompt,
      }
    ],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0].message.content);
  pushToCloud(file_id, completion.choices[0].message.content);
}

function pushToCloud(file_id, data)
{
  db.ref(`${file_id}/data`).set(data);

  db.ref('test').once('value', (snapshot) => {

    process.exit();
  });
}

for (let i = 0; i < ids.length; i++) {
  main(ids[i]);
}