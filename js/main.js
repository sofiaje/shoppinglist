//------------------------------------hämta listor och lägg till i select meny-----------

async function getMyListsFromAPI() {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015`);
    const data = await res.json();

    return data;
}


getMyListsFromAPI()
    .then((data) => {
        
        let listArray = data.itemList
        console.log(listArray)
        listArray.forEach(element => {
            createOption(element.title, element.id)
        });
})


function createOption(name, id) {
    let select = document.getElementById("lists")
    let option = document.createElement("option")
    option.innerText = name
    option.value = id
    select.append(option)
}


//------------------------------------lägg till ny lista------------------------------------


let newListInput = document.getElementById("newList")
let newListBtn = document.getElementById("newListBtn")

newListBtn.addEventListener("click", () => {
    createNewList();
})


//id på min list-id lista i API (kom ihåg)
const id = "640077fe373f792f6370c015"


//skapar ny lista som användaren bestämmer namn på
async function createNewList() {
    let newListInput = document.getElementById("newList").value
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



//sparar alla nya listor i min lista med listid
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





//------------------------------------lägg till items------------------------------------

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
