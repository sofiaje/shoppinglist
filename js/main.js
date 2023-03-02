//------------------------------------global--------------------------------------------

let selectMenu = document.getElementById("lists")
let newListInput = document.getElementById("newList")
let newListBtn = document.getElementById("newListBtn")

let addItemDiv = document.getElementById("addItemDiv");
let listDiv = document.getElementById("listDiv");


let errorP = document.querySelector(".error");
progressList = document.getElementById("progressList");






//------------------------------------fetch lists and append in select menu -----------

async function getAllListsFromAPI() {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015`);
    const data = await res.json();

    return data;
}


getAllListsFromAPI()
    .then((data) => {

        let listArray = data.itemList
        console.log(listArray)

        listArray.forEach(element => {
            createOption(element.title, element.id)
            createAccordion(element)
        });
    })



function createOption(name, id) {
    let option = document.createElement("option")
    option.innerText = name
    option.value = id
    selectMenu.append(option)
}


function createAccordion(list) {
    console.log("element in accordion function", list);

    let accordionWrapper = document.createElement("div");
    accordionWrapper.classList.add("accordionWrapper")
    accordionWrapper.innerHTML = `
    <div class="accordionHead">
    <h2>${list.title}</h2><i class="fa-solid fa-chevron-down"></i></div>
    <div class="accordionBody hidden">hej</div>`
    document.body.append(accordionWrapper)

    accordionWrapper.addEventListener("click", () => {
        let accordionBody = accordionWrapper.querySelector(".accordionBody")
        accordionBody.classList.toggle("hidden")
    })
}




//------------------------------------fetch lists and append in browser -----------




//------------------------------------add new list----------------------------------------

newListBtn.addEventListener("click", () => {
    let newListInput = document.getElementById("newList")
    if (newListInput.value) {
        errorP.classList.add("hidden")
        createNewList(newListInput.value);
        newListInput.value = ""
    } else {
        errorP.classList.remove("hidden")
    }

})


//id på min list-id lista i API (kom ihåg)
const id = "640077fe373f792f6370c015"



//create new list from userInput
async function createNewList(newListInput) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            listname: newListInput,
        }),
    });
    const { list } = await res.json();

    saveNewList(list.listname, list._id)
    createOption(list.listname, list._id)
}



//saves all new lists in my list-id list in API
async function saveNewList(listName, listId) {
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015/items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: listName,
                id: listId,
            }),
        }
    );
    const { list } = await res.json();
}






//------------------------------------choose list in select menu and display in browser--------------

selectMenu.addEventListener("change", (e) => {
    progressList.innerText = ""
    console.log(e.target.value)
    let userSelect = e.target.value;

    if (userSelect) {
        addItemDiv.classList.remove("hidden")
        listDiv.classList.remove("hidden")
        getSpecificListFromAPI(userSelect)
            .then((data) => {
                displayItems(data)
            })
    } else {
        addItemDiv.classList.add("hidden")
        listDiv.classList.add("hidden")
        console.log("false")
    }


})



async function getSpecificListFromAPI(id) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/${id}`);
    const data = await res.json();

    return data;
}


function displayItems(data) {
    // console.log(data)
    let listTitle = document.getElementById("listTitle");
    listTitle.innerHTML = `${data.listname}`;

    let itemList = data.itemList;
    // console.log(itemList)

    itemList.forEach(element => {
        // console.log(element.title)
        let li = document.createElement("li")
        li.innerText = element.title;
        progressList.append(li)
    });
}





//------------------------------------add new item------------------------------------------

class listItem {
    constructor(name, qty) {
        this.name = name;
        this.qty = qty;
    }
}





let itemListArray = []
const addItemBtn = document.querySelector(".addItemBtn")

addItemBtn.addEventListener("click", () => {
    let name = document.getElementById("itemName")
    let qty = document.getElementById("itemQty")

    let item = new listItem(name.value, qty.value)

    itemListArray.push(item)
    console.log(itemListArray)

    name.value = ""
    qty.value = ""
})
