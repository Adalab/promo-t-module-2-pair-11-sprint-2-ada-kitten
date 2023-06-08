'use strict';

/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputName = document.querySelector('.js-input-name');
const inputRace = document.querySelector('.js-input-race');

const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMessageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const input_search_race = document.querySelector('.js_in_search_race');


//Objetos con cada gatito
/* const kittenData_1 = {
    image: "https://dev.adalab.es/gato-siames.webp",
    name: "Anastacio",
    desc: "Porte elegante, su patrón de color tan característico y sus ojos de un azul intenso, pero su historia se remonta a Asía al menos hace 500 años, donde tuvo su origen muy posiblemente.",
    race: "Siamés",
};
const kittenData_2 = {
    image: "https://dev.adalab.es/sphynx-gato.webp",
    name: "Fiona",
    desc: "Produce fascinación y curiosidad. Exótico, raro, bello, extraño… hasta con pinta de alienígena han llegado a definir a esta raza gatuna que se caracteriza por la «ausencia» de pelo.",
    race: "Sphynx",
};
const kittenData_3 = {
    image: "https://dev.adalab.es/maine-coon-cat.webp",
    name: "Cielo",
    desc: " Tienen la cabeza cuadrada y los ojos simétricos, por lo que su bella mirada se ha convertido en una de sus señas de identidad. Sus ojos son grandes y las orejas resultan largas y en punta.",
    race: "Maine Coon",
}; */

let kittenDataList = [];

// VARIABLES PARA PETICIONES AL SERVIDOR
const GITHUB_USER = 'MiriamPaternain';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;

const kittenListStored = JSON.parse(localStorage.getItem('kittensList'));

if(kittenListStored){
  kittenDataList = kittenListStored;
} else {
fetch(SERVER_URL)
    .then((response) => response.json())
    .then((data) => {
        kittenDataList = data.results;
        renderKittenList(kittenDataList);
        localStorage.setItem('kittensList',JSON.stringify(kittenDataList));
    })
}

//Funciones
function renderKitten(kittenData) {
    const liElement = document.createElement('li');
    liElement.classList.add('card');
    const article = document.createElement('article');
    const kittenImg = document.createElement('img');
    const kittenName = document.createElement('h3');
    const kittenRace = document.createElement('h3');
    const kittenDesc = document.createElement('p');
    liElement.appendChild(article);
    // IMAGEN
    article.appendChild(kittenImg);
    kittenImg.classList.add('card_img');
    kittenImg.src = kittenData.image;
    kittenImg.alt = 'gatito';
    // NOMBRE
    article.appendChild(kittenName);
    kittenName.classList.add('card_title');
    const kittenNameText = document.createTextNode(kittenData.name);
    kittenName.appendChild(kittenNameText);
    // RAZA
    article.appendChild(kittenRace);
    kittenRace.classList.add('card_race');
    const kittenRaceText = document.createTextNode(kittenData.race);
    kittenRace.appendChild(kittenRaceText);
    // DESC
    article.appendChild(kittenDesc);
    kittenDesc.classList.add('card_description');
    const kittenDescText = document.createTextNode(kittenData.desc);
    kittenDesc.appendChild(kittenDescText);
    console.log(liElement);
    return liElement;
    /* const kitten = `<li class="card">
    <article>
      <img
        class="card_img"
        src=${kittenData.image}
        alt="gatito"
      />
      <h3 class="card_title">${kittenData.name}</h3>
      <h3 class="card_race">${kittenData.race}</h3>
      <p class="card_description">
      ${kittenData.desc}
      </p>
    </article>
    </li>`; 
    return kitten;*/
}

function renderKittenList(kittenDataList) {
    listElement.innerHTML = "";
        // let i = 0; i < kittenDataList.length; i++
    for (const kittenItem of kittenDataList) {
        //listElement.innerHTML += renderKitten(kittenItem); //kittenDataList[i]
        listElement.appendChild(renderKitten(kittenItem));
    }
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
    newFormElement.classList.remove('collapsed');
}
function hideNewCatForm() {
    newFormElement.classList.add('collapsed');
}
function handleClickNewCatForm(event) {
    event.preventDefault();
    if (newFormElement.classList.contains('collapsed')) {
        showNewCatForm();
    } else {
        hideNewCatForm();
    }
}

//Adicionar nuevo gatito
function addNewKitten(event) {
    event.preventDefault();
    const valueDesc = inputDesc.value;
    const valuePhoto = inputPhoto.value;
    const valueName = inputName.value;
    const valueRace = inputRace.value;
    const newKittenDataObject = {
        image: valuePhoto,
        name: valueName,
        desc: valueDesc,
        race: valueRace,
    };
    
    if (valueDesc === "" || valuePhoto === "" || valueName === "") {
        labelMessageError.innerHTML = "¡Uy! parece que has olvidado algo";
    }
     else if (valueDesc !== "" && valuePhoto !== "" && valueName !== "") {
        labelMessageError.innerHTML = "";
    } 
    const resetValues = () => {inputDesc.value = ""; inputPhoto.value=""; inputName.value=""; inputRace.value=""; }
    

    fetch(`https://dev.adalab.es/api/kittens/${GITHUB_USER}`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(newKittenDataObject),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      //Completa y/o modifica el código:
      //Agrega el nuevo gatito al listado
      kittenDataList.push(newKittenDataObject);
      renderKittenList(kittenDataList);
      //Guarda el listado actualizado en el local stoarge
      localStorage.setItem('kittensList',JSON.stringify(kittenDataList));
      //Visualiza nuevamente el listado de gatitos
      //Limpia los valores de cada input
      resetValues();
      hideNewCatForm();
    } else {
      //muestra un mensaje de error.
     
      console.log('Ha habido un error.');
    }
  });
    // valueDesc.reset();
}

//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
    event.preventDefault();
    newFormElement.classList.add("collapsed");
    inputDesc.value = "";
    inputPhoto.value = "";
    inputName.value = "";
}

//Filtrar por descripción

function filterKitten(event) {
    event.preventDefault();
    const descrSearchText = input_search_desc.value;
    const raceSearchText = input_search_race.value;
    listElement.innerHTML = "";
    const filterKittenSearch = kittenDataList.filter ((item) => item.desc.includes(descrSearchText) )
    .filter ((item) => item.race.includes(raceSearchText));
    renderKittenList(filterKittenSearch);
}


//Mostrar el litado de gatitos en ell HTML
renderKittenList(kittenDataList);

//Eventos
linkNewFormElememt.addEventListener("click", handleClickNewCatForm);
searchButton.addEventListener("click", filterKitten);
buttonAdd.addEventListener("click", addNewKitten);
buttonCancelForm.addEventListener("click", cancelNewKitten);


//  02 06 2023 
// Escuchar evento click de Añadir: buttonAdd

//05 06 2023
// filtrar

// 06 06 2023
// Peticiones al servidor

// 07 06 2023
// localStorage

// 08 06 2023
// Cambiar a DOM Avanzado
