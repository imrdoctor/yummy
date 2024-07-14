// Elements Selection
const controlNav = document.querySelector(".controlnav");
const sidebar = document.querySelector(".sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar .links a");
const searchbtn = document.querySelector(".searchbtn");
const categoryBtn = document.querySelector(".category");
const search = document.querySelector(".search");
const areaBtn = document.querySelector(".arealink");
const searchNameInput = document.querySelector(".search .searchname");
const searchFirstLetterInput = document.querySelector(".search .serchfirstletter");
const mealList = document.getElementById('mealList');
const rowData = document.getElementById('rowData');
const rowCountry = document.querySelector("#rowCountryData .items");
const loader = document.querySelector('.loading');
const countryButtons = document.querySelectorAll('.country-btn');
const ingredientsContainer = document.querySelector('.ingredients .container');
const ingredientsBtn = document.querySelector(".ingredientslink")
const ingredients = document.querySelector(".ingredients")
const contactBtn = document.querySelector(".contactlink")
const contactusSec = document.querySelector(".contactus")
const emailRegx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const passRegx = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{7,}$/;
const userRegx = /^(?!.*__)[a-zA-Z]+(?: [a-zA-Z]+){0,2}$/;
const phoneRegx = /^\d{10,}$/; // Assuming phone number should be at least 10 digits
const ageRegx = /^(?:\d{1,2}|100)$/; // Age from 1 to 99

const userNameInput = document.getElementById('username');
const useremailInput = document.getElementById('email');
const userphoneInput = document.getElementById('phone');
const userageInput = document.getElementById('age');
const userpasswordInput = document.getElementById('password');
const userRepassword = document.getElementById('repassword');
const sendBtn = document.querySelector('.sendmasage');

// Function to show loader
function showLoader() {
    loader.classList.remove('hidden');
}

// Function to hide loader
function hideLoader() {
    loader.classList.add('hidden');
}

// Function to hide row data
function hidemealList() {
    mealList.innerHTML = '';

}

// Function to hide all sections except the specified one
function hideAllSections(exceptSection) {
    search.classList.add('hidden');
    rowCountry.classList.add('hidden');
    hidemealList()
    exceptSection.classList.remove('hidden');
}

// Function to fetch meals by area (country)
async function getAreaMeals(area) {
    try {
        showLoader();
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await api.json();
        renderMealList(data.meals, true);
    } catch (error) {
        console.error('Error fetching meals by area:', error);
    } finally {
        hideLoader();
    }
}

// Function to fetch meals by category
async function getCatMeals(category) {
    try {
        showLoader(); 
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await api.json();
        renderMealList(data.meals, true);
    } catch (error) {
        console.error('Error fetching meals by category:', error);
    } finally {
        hideLoader();
    }
}

// Function to render meals
function renderMealList(meals, fetchDetails = false) {
    hidemealList()
    if (!meals) {
        console.error('No meals found.');
        return;
    }

    meals.forEach(meal => {
        const itemHTML = `
            <div class="item flex flex-col justify-center items-center sm:col-span-2 md:col-span-1 relative overflow-hidden item_perant rounded">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full">
                <h2 class="text-2xl font-bold text-center absolute inset-0 text-left bg-opacity-50 flex items-center descreption p-2">
                    ${meal.strMeal}
                </h2>
            </div>
        `;
        mealList.insertAdjacentHTML('beforeend', itemHTML);

        // Event listener for each meal item
        const mealItem = mealList.lastElementChild;
        mealItem.addEventListener('click', async function() {
            if (fetchDetails) {
                const mealDetails = await getMealDetails(meal.idMeal);
                showMealDetails(mealDetails);
            } else {
                showMealDetails(meal);
            }
            hideAllSections(rowData);
            hidemealList()
            sidebar.classList.remove('active');
            hideOtherMeals(mealItem);
        });
    });
}

// Function to fetch meal details by ID
async function getMealDetails(mealId) {
    try {
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await api.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
}

// Function to show detailed meal information

function showMealDetails(meal) {
    // لو في تاج هتظهر عادي لو مفيش مش هتظهر
    const tagsHTML = meal.strTags ? `
    <div class="w-full max-w-xs">
        <h3 class="font-bold">Tags:</h3>
        <div class="bg-red-200 text-white rounded mb-4 m-2 p-1 w-auto inline-block max-w-max">${meal.strTags}</div>
    </div>` : '';
    rowData.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-5">
            <div class="flex flex-col py-6 px-5 items-center rounded">
                <img class="w-2/3 rounded-lg" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2 class="text-2xl font-bold mt-4 text-white">${meal.strMeal}</h2>
            </div>
            <div class="py-4 px-4 md:px-0 text-white">
                <h2 class="text-2xl font-bold">Instructions</h2>
                <p class="mt-4">${meal.strInstructions}</p>
                <div class="mt-4">
                    <h3 class="font-bold">Area: ${meal.strArea}</h3>
                    <h3 class="font-bold">Category: ${meal.strCategory}</h3>
                    <h3>Ingredients:</h3>
                    <ul class="flex flex-wrap gap-3 list-none">
                        ${getIngredientsList(meal)}
                    </ul>
                    ${tagsHTML}
                    <a target="_blank" href="${meal.strSource}" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Source</a>
                    <a target="_blank" href="${meal.strYoutube}" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Youtube</a>
                </div>
            </div>
        </div>
    `;
}

function hidedetils(meal){
    rowData.innerHTML = ``
}
// Function to generate ingredients list
function getIngredientsList(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="bg-blue-300 rounded m-2 p-1 ">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }
    return ingredients;
}
function hideMealDetails(){
    mealDetails.innerHTML = '';
}
// Function to hide other meals when one is selected
function hideOtherMeals(selectedMeal) {
    const mealItems = document.querySelectorAll('.item_perant');
    mealItems.forEach(item => {
        if (item !== selectedMeal) {
            item.classList.add('hidden');
            search.classList.add("hidden");
        }
    });
}

// Event listener for country buttons
countryButtons.forEach(button => {
    button.addEventListener('click', function() {
        const country = button.getAttribute('data-country');
        getAreaMeals(country);
        
        hideAllSections(rowCountry);
    });
});

// Event listener for sidebar toggle
controlNav.addEventListener("click", function() {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
        sidebarLinks.forEach((element) => {
            element.classList.remove("hide");
        });
    } else {
        sidebarLinks.forEach((element) => {
            element.classList.add("hide");
        });
    }
});
sidebarLinks.forEach(link => {
    link.addEventListener("click", function() {
        sidebar.classList.remove("active");
    });
});

// Event listener for search button
searchbtn.addEventListener("click", function() {
    hideContact()
    hideIngredients()
    hideAllSections(search);
    rowData.innerHTML = "";
    if (!search.classList.contains("hidden")) {
        hidemealList()
    } else {
        getDefaultData();
    }
});

// Fetch default data on page load
document.addEventListener('DOMContentLoaded', function () {
    getDefaultData();
});

async function getDefaultData() {
    try {
        let response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        let data = await response.json();
        showLoader();
        renderMealList(data.meals);
        
    } catch (error) {
        console.error('Error fetching default data:', error);
    } finally {
        hideLoader();
    }
}

// Search by name
searchNameInput.addEventListener('input', function () {
    const searchedValue = searchNameInput.value.trim();
    getSearchData(searchedValue);
});

async function getSearchData(searchTerm) {
    try {
        showLoader(); 
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await api.json();
        renderMealList(data.meals);
    } catch (error) {
        console.error('Error fetching search data:', error);
    } finally {
        hideLoader();
    }
}

// Search by first letter
searchFirstLetterInput.addEventListener('input', function () {
    const firstLetter = searchFirstLetterInput.value.trim().charAt(0).toUpperCase();
    if (firstLetter.match(/[A-Z]/)) {
        serchByFirstLetter(firstLetter);
    }
});

async function serchByFirstLetter(firstLetter) {
    try {
        showLoader(); 
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`);
        const data = await api.json();
        renderMealList(data.meals);
    } catch (error) {
        console.error('Error fetching meals by first letter:', error);
    } finally {
        hideLoader();
    }
}

// Event listener for category button
categoryBtn.addEventListener("click", function() {
    hideAllSections(rowData);
    fetchCategories();
    hideIngredients()
    hideContact()
});

// Function to fetch categories
async function fetchCategories() {
    try {
        showLoader(); 
        const api = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await api.json();
        renderCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        hideLoader();
    }
}

// Function to render categories
function renderCategories(categories) {
    if (!categories) {
        console.error('No categories found.');
        return;
    }

    rowData.innerHTML = `
    <div class="category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        ${categories.map(category => `
            <div class="category-item flex flex-col justify-center items-center relative overflow-hidden item_perant rounded">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full">
                <h2 class="text-2xl font-bold text-center absolute inset-0 text-left bg-opacity-50 flex items-center descreption p-2">
                    ${category.strCategory}
                </h2>
            </div>
        `).join('')}
    </div>
`;


    // Add event listener to each category item
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = item.querySelector('h2').innerText;
            getCatMeals(category);
            hideAllSections(rowData);
        });
    });
}

// Event listener for area button
areaBtn.addEventListener("click", function() {
    hideAllSections(rowCountry);
    hideContact()
    fetchAreas();
    hideIngredients()
    rowData.innerHTML = "";
});

// Function to fetch areas
async function fetchAreas() {
    try {
        showLoader(); 
        const api = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = await api.json();
        renderAreas(data.meals);
    } catch (error) {
        console.error('Error fetching areas:', error);
    } finally {
        hideLoader();
    }
}

// Function to render areas
function renderAreas(areas) {
    if (!areas) {
        console.error('No areas found.');
        return;
    }

    rowCountry.innerHTML = areas.map(area => `
        <button data-country="${area.strArea}" class="country-btn  text-white font-bold py-2 px-4 rounded">
           <i class="fa-solid fa-house-laptop fa-4x"></i>
           <p> ${area.strArea}</p>
        </button>`).join('');
    // Add event listener to each country button
    const countryButtons = document.querySelectorAll('.country-btn');
    countryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const country = button.getAttribute('data-country');
            getAreaMeals(country);
            hideAllSections(rowCountry);
            rowCountry.classList.add('hidden');
        });
    });
}


// 



// Function to fetch ingredients from API
async function getIngredients() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();
        return data.meals; // Return the array of ingredients
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        return []; // Return empty array on error
    }
}

// Function to render ingredients in the UI
function renderIngredients(ingredients) {
    // Clear previous content
    ingredientsContainer.innerHTML = '';

    // Get only the first 20 items from the ingredients array
    ingredients.slice(0, 20).forEach(ingredient => {
        // Extract the first 20 words of the description
        const shortDescription = ingredient.strDescription ? ingredient.strDescription.split(' ').slice(0, 20).join(' ') + '...' : 'Description not available';
        
        const html = `
            <div class="ingredients_item p-4 rounded-lg text-center text-white flex flex-col cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h1 class="text-2xl font-bold">${ingredient.strIngredient}</h1>
                <p>${shortDescription}</p>
            </div>
        `;
        ingredientsContainer.innerHTML += html; // Append each item to the container
    });

    // Add event listeners to each ingredient item
    const ingredientItems = document.querySelectorAll('.ingredients_item');
    ingredientItems.forEach(item => {
        item.addEventListener('click', function() {
            const ingredientName = item.querySelector('h1').innerText;
            getMealsByIngredient(ingredientName);
            hideIngredients()
        });
    }
);
}

// Function to show ingredients section
function showIngredients() {
    ingredients.classList.remove("hidden")
}
function hideIngredients(){
    ingredients.classList.add("hidden")
}
// Function to fetch ingredients and render them on page load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const ingredients = await getIngredients(); // Fetch ingredients
        renderIngredients(ingredients); // Render ingredients in UI
    } catch (error) {
        console.error('Error loading ingredients:', error);
    }
});

// Function to fetch meals by ingredient
async function getMealsByIngredient(ingredient) {
    try {
        showLoader(); 
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await api.json();
        renderMealList(data.meals, true); // Assuming renderMealList is updated to handle meal rendering
        sidebar.classList.remove("active");
    } catch (error) {
        console.error('Error fetching meals by ingredient:', error);
    } finally {
        hideLoader();
    }
}
ingredientsBtn.addEventListener("click",function(){
    showIngredients()
    hideAllSections(rowData);
    hidemealList()
    rowData.innerHTML = "";
    hideContact()
})




// const userNameInput = document.getElementById('username');
// const useremailInput = document.getElementById('email');
// const userphoneInput = document.getElementById('phone');
// const userageInput = document.getElementById('age');
// const userpasswordInput = document.getElementById('password');
// const userRepassword = document.getElementById('repassword');


// const userNameInput = document.getElementById('username');

let isUsernameValid = false;
let isEmailValid = false;
let isPhoneValid = false;
let isAgeValid = false;
let isPasswordValid = false;
let arePasswordsMatching = false;

function validateField(inputElement, regex) {
    const nextElement = inputElement.nextElementSibling;
    if (nextElement && nextElement.tagName.toLowerCase() === 'p') {
        if (regex.test(inputElement.value)) {
            nextElement.classList.add("hidden");
            return true;
        } else {
            nextElement.classList.remove("hidden");
            return false;
        }
    }
}

function validatePassword() {
    const nextElement = userpasswordInput.nextElementSibling;
    if (nextElement && nextElement.tagName.toLowerCase() === 'p') {
        if (passRegx.test(userpasswordInput.value)) {
            nextElement.classList.add("hidden");
            isPasswordValid = true;
        } else {
            nextElement.classList.remove("hidden");
            isPasswordValid = false;
        }
    }
}

function validateMatchingPasswords() {
    const nextElement = userRepassword.nextElementSibling;
    if (nextElement && nextElement.tagName.toLowerCase() === 'p') {
        if (userRepassword.value === userpasswordInput.value) {
            nextElement.classList.add("hidden");
            arePasswordsMatching = true;
        } else {
            nextElement.classList.remove("hidden");
            arePasswordsMatching = false;
        }
    }
}

// Add event listeners for each input field
userNameInput.addEventListener("input", function () {
    isUsernameValid = validateField(userNameInput, userRegx);
    validateonstatus();
});

useremailInput.addEventListener("input", function () {
    isEmailValid = validateField(useremailInput, emailRegx);
    validateonstatus();
});

userphoneInput.addEventListener("input", function () {
    isPhoneValid = validateField(userphoneInput, phoneRegx);
    validateonstatus();
});

userageInput.addEventListener("input", function () {
    isAgeValid = validateField(userageInput, ageRegx);
    validateonstatus();
});

userpasswordInput.addEventListener("input", function () {
    validatePassword();
    validateMatchingPasswords();
    validateonstatus();
});

userRepassword.addEventListener("input", function () {
    validateMatchingPasswords();
    validateonstatus();
});

// Log validation status if all fields are valid
function validateonstatus() {
    if (isUsernameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && arePasswordsMatching) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}
function clearinputs (){
    userNameInput.value = null;
    useremailInput.value = null;
    userphoneInput.value = null;
    userageInput.value = null;
    userpasswordInput.value = null;
    userRepassword.value = null;
}
// Add event listener for the send button
sendBtn.addEventListener("click", function () {
    const nextElement = sendBtn.nextElementSibling;
    if (nextElement && nextElement.tagName.toLowerCase() === 'p') {
        nextElement.classList.remove("hidden");
        setTimeout(function () {
            nextElement.classList.add("hidden");
        }, 5000);
    }
    clearinputs();
});



function showContact(){
    contactusSec.classList.remove("hidden")
}
function hideContact(){
    contactusSec.classList.add("hidden")
}
contactBtn.addEventListener("click",function(){
    hideAllSections(rowData);
    hidemealList()
    rowData.innerHTML = "";
    hideIngredients()
    showContact()
})
