const loader = document.querySelector(".loader")

//recuperation les coordonnées navigateur
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location => {
        const long = location.coords.longitude;
        const lat = location.coords.latitude;
        console.table(location, long, lat)
        getWeatherData(long, lat)
    }, () => {
        loader.textContent = "Vous avez refuser la géolocalisation,l'application ne peut pas fonctionner ,veuillez l'activer"

    })
}


//fonction de l'appel Api
async function getWeatherData(long, lat) {

    try {
        const results = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=f7e8875364172716df2007ed48555eac`)
        if (!results.ok) {
            throw new Error(`result: ${results.status}`)
        }
        const data = await results.json()

        //envoi de donner a la fonction populate
        populateMainInfo(data)
        //envoi de donné fonction de prediction
        handleHours(data.hourly)
        handleDays(data.daily)

        console.log(data);
        //on ajoute les propriétés fade out a notre classe loader dêja existant
        loader.classList.add("fade-out")
    } catch (error) {

        loader.textContent = error
        console.log(error)

    }

}

const position = document.querySelector(".position")
const temperature = document.querySelector(".temperature")
const weatherImage = document.querySelector(".weather-image")
const currentHour = new Date().getHours()


function populateMainInfo(data) {
    //math trunc permet d'enlever le chiffre apres la virgule
    temperature.textContent = `${Math.trunc(data.current.temp)}°`;
    position.textContent = data.timezone;
    //condition pour verfier si on est le h=jour ou la nuit
    if (currentHour >= 6 && currentHour < 21) {
        weatherImage.src = `ressources/jour/${data.current.weather[0].icon}.svg`
    } else {
        weatherImage.src = `ressources/nuit/${data.current.weather[0].icon}.svg`

    }

}

const hourNameBlocks = document.querySelectorAll(".hour-name");
const hourTemperatures = document.querySelectorAll(".hour-temp");

//fonctio prediction de la semaine 
function handleHours(data) {

    //imcrementer l'heure +3
    hourNameBlocks.forEach((block, index) => {
        const incrementedHour = currentHour + index * 3;

        if (incrementedHour > 24) {
            const calcul = incrementedHour - 24;
            hourNameBlocks[index].textContent = `${calcul === 24 ? "00" : calcul}h`
        }
        else if (incrementedHour === 24) {
            hourNameBlocks[index].textContent = "00h";
        }
        else {
            hourNameBlocks[index].textContent = `${incrementedHour}h`
        }

        // Blocs de Temperature
        hourTemperatures[index].textContent = `${Math.trunc(data[index * 3].temp)}°`
    })

}

const weekDays = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche"
  ]

  //recuperation du jours 
  const currentDay =new Date().toLocaleDateString("fr-FR", {weekday:"long"})
  console.log(currentDay)

  const orderedDay=weekDays.slice(weekDays.indexOf(currentDay)+1)


  const forecastDays = weekDays.slice(weekDays.indexOf(currentDay) + 1).concat(weekDays.slice(0, weekDays.indexOf(currentDay) + 1))
  const daysName = document.querySelectorAll(".day-name")
  const perDayTemperature = document.querySelectorAll(".day-temp")

  function handleDays(data){

    forecastDays.forEach((day, index) => {
      daysName[index].textContent = forecastDays[index].charAt(0).toUpperCase() + forecastDays[index].slice(1, 3);
  
      perDayTemperature[index].textContent = `${Math.trunc(data[index + 1].temp.day)}°`
    })
    
  }

  // Tabs 

const tabsBtns = [...document.querySelectorAll(".tabs button")]
const tabsContents = [...document.querySelectorAll(".forecast")]

tabsBtns.forEach(btn => btn.addEventListener("click", handleTabs))

function handleTabs(e) {
  const indexToRemove = tabsBtns.findIndex(tab => tab.classList.contains("active"))

  tabsBtns[indexToRemove].classList.remove("active")
  tabsContents[indexToRemove].classList.remove("active")

  const indexToShow = tabsBtns.indexOf(e.target)
 
  tabsBtns[indexToShow].classList.add("active")
  tabsContents[indexToShow].classList.add("active")
}

