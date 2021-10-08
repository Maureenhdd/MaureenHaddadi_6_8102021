function createCardRecipe(e) {
    return `
    <div class="card " style="width: 25rem;">
    <img src="#" class="card-img-top" alt="...">
    <div class="card-body">
        <div class="card-body-top">
            <h5 class="card-title">${e.name}</h5>
            <div class="card-body-top-time">
                <i class="far fa-clock card-body-top__i"></i>
                <p class="card-time ">${e.time}min</p>
            </div>
        </div>
        <div class="card-body-bottom">
        <ul>
        ${e.ingredients.map(ingredient => {
        return `
        <li> ${ingredient.ingredient} : ${ingredient.quantity || ''} ${ingredient.unit || ''}</li>
        `
    }).join('')}
            </ul>
            <p class="card-text">${e.description}</p>
            <p>${e.appliance}</p>
        </div>

    </div>
</div>
    
    `
}


function createList(e) {
    return `
        <li class="refined_search__li">${e}</li>
    `
}

function createTag(e) {
    return `
        <div class="refined_search_tag__content">${e} <i class="far fa-times-circle remove-tag"></i> </div>
    `
}
