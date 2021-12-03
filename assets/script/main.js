/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const cardList = document.querySelector('.card_list_section')
const openList = document.querySelectorAll('.refined_search__btn')

const userSearch = document.querySelector('.search_bar_section__input')
const tagSection = document.querySelector('.refined_search_tag')



function filterByTags(recipes, arraySelectedTag) {
    const result = recipes.filter(recipe => {
        // ananas , ail
        let bool = []
        for (let tagSelected of arraySelectedTag) {
            if (tagSelected.type === "ingredients") {
                bool.push(recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).includes(tagSelected.text.toLowerCase()))
            } else if (tagSelected.type === "appliances") {
                bool.push(recipe.appliance.toLowerCase().includes(tagSelected.text.toLowerCase()))
            } else if (tagSelected.type === "ustensils") {
                bool.push(recipe.ustensils.some((ust) => ust.toLowerCase().includes(tagSelected.text.toLowerCase())))
            }
        }
        return bool.includes(false) ? false : true
    })
    displayRecipes(result)
}


// filter by items

function filterByItems(arrayItems, recipes, type) {
    const inputItem = document.querySelector(`.refined_search--${type}`)
    inputItem.addEventListener('input', function (e) {
        let query = e.target.value
        let filteredItems = arrayItems.filter(i => {
            return i.toLowerCase().includes(query.toLowerCase())
        })
        displaySelectedTags(filteredItems, type)
        pushItem(recipes)

    })
}


function isTagInArray(arrayItem) {
    const li = document.querySelectorAll('.refined_search__li')
    const arrayText = arrayItem.map(text => text.text)
    li.forEach(e => {
        let key = e.getAttribute('data-key')
        arrayText.includes(key) ? e.style.pointerEvents = "none" : e.style.pointerEvents = "auto"
    })
}




function displayTags(arrayItem, recipes) {
    tagSection.innerHTML = ''
    arrayItem.map(item => tagSection.innerHTML += createTag(item.text, item.type))
    const removeTag = document.querySelectorAll('.remove-tag')

    removeTag.forEach(i => {
        i.addEventListener('click', () => {
            const index = arrayItem.indexOf(i);
            arrayItem.splice(index, 1);
            displayTags(arrayItem, recipes)
            filterByTags(recipes, arrayItem)
            isTagInArray(arrayItem)

        })
    })

}



function pushItem(recipes) {
    const tag = document.querySelectorAll('.refined_search_tag__content')
    const li = document.querySelectorAll('.refined_search__li')

    const refinedTags = document.querySelector('.refined_search_tag')
    let arrayItem = []
    Array.from(refinedTags.children).forEach(e => {
        arrayItem.push({ text: e.getAttribute('data-key'), type: e.getAttribute('data-type') })
    })


    li.forEach(i => {
        let themeList = i.getAttribute('data-list')
        i.addEventListener('click', function () {
            let valueLi = i.innerHTML
            arrayItem.push({ text: valueLi, type: themeList })

            themeList === "ingredients" ? tag.forEach(t => {
                t.classList.add('refined_search_tag__content__ingredients')
            }) : null

            displayTags(arrayItem, recipes)
            filterByTags(recipes, arrayItem)
            isTagInArray(arrayItem)
        })

    })
    return arrayItem
}



function extractIngredients(recipes) {
    let arrayIngredients = []
    recipes.map(recipe => {
        recipe.ingredients.map(ingredient => {
            arrayIngredients.push(ingredient.ingredient)

        })
    })
    return arrayIngredients
}



function extractAppliances(recipes) {
    let arrayAppliances = []
    recipes.map(appliance => {
        arrayAppliances.push(appliance.appliance)
    })

    return arrayAppliances
}



function extractUstensils(recipes) {
    let arrayUstensils = []
    recipes.map(recipe => {

        recipe.ustensils.map(ustensil => {
            arrayUstensils.push(ustensil)
        })
    })

    return arrayUstensils

}

function normalizeArray(array) {
    array = [...new Set(array)].sort()
    let arrayNormal = []
    array = array.map(i => {
        let normalI = i.endsWith('s') ? i.substring(0, i.length - 1) : i
        normalI = normalI.toLowerCase()
        normalI = normalI.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        // normalI = normalI.replace(/[&/\\#,+()$~%.":*?<>{}]/g, "")

        if (arrayNormal.includes(normalI)) {
            return null
        } else {
            arrayNormal.push(normalI)
        }
        return i
    }).filter(el => el !== null)
    return array
}

openList.forEach(item => {
    const listSection = item.parentNode.parentNode.querySelector('.refined_search__list')
    const openListI = item.parentNode.parentNode.querySelector('.open_list__i')
    item.addEventListener('click', () => {
        listSection.classList.toggle('active_list')
        openListI.classList.toggle('opened_list')
    })
})


// display item 

function displayRecipes(recipes) {
    cardList.innerHTML = ' '
    recipes.map(e => cardList.innerHTML += createCardRecipe(e))
}

function displaySelectedTags(arraySelectedTags, type) {
    const list = document.querySelector(`.list--${type}`)
    list.innerHTML = ''
    list.innerHTML = normalizeArray(arraySelectedTags).map(i => createList(i, type)).join('')
}


const listAppliance = document.querySelector('.list--appliances')
const listUstensils = document.querySelector('.list--ustensils')


function getData() {

    return new Promise((resolve, reject) => {
        fetch('/assets/script/recipe.json')
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}


getData().then(({ recipes }) => {
    displayRecipes(recipes)
    const arrayIngredients = extractIngredients(recipes)
    const arrayAppliances = extractAppliances(recipes)
    const arrayUstensils = extractUstensils(recipes)


    displaySelectedTags(arrayIngredients, 'ingredients')
    displaySelectedTags(arrayAppliances, 'appliances')
    displaySelectedTags(arrayUstensils, 'ustensils')


    pushItem(recipes)
    filterByItems(arrayIngredients, recipes, 'ingredients')
    filterByItems(arrayUstensils, recipes, 'ustensils')
    filterByItems(arrayAppliances, recipes, 'appliances')

})

