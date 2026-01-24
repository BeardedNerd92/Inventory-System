
const productName = document.getElementById("product-name");
const quantity = document.getElementById("quantity");
const form = document.getElementById("inventory-form");
const inventoryList = document.getElementById("inventory-list")

form.addEventListener("submit", handleFormData);
const inventory = [];


function handleFormData(e) {
    e.preventDefault();
    const productNameData = productName.value.trim();
    const quantityData = Number(quantity.value); 
    if (productNameData === "") {
        return;
    }
    if (quantityData < 0 || Number.isNaN(quantityData)) {
        return;
    }
    inventory.push({
        name: productNameData,
        quantity: quantityData
    });
    saveListItems();
    renderListItems();
    productName.value = "";
    quantity.value = "";
    productName.focus();
}

function removeListItem(index) {
    inventory.splice(index, 1);
    saveListItems();
    renderListItems();
}

function saveListItems() {
    localStorage.setItem("Inventory", JSON.stringify(inventory))
}

function renderListItems() {
     inventoryList.innerHTML = "";
     inventory.forEach((item, index) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        const deleteBtn = document.createElement("button");
        text.textContent = `${item.name} - ${item.quantity}`
        deleteBtn.textContent = "Delete Item";
        deleteBtn.addEventListener("click", () => removeListItem(index));
        li.appendChild(text);
        li.appendChild(deleteBtn);
        inventoryList.appendChild(li);
     })
}

const getListItems = localStorage.getItem("Inventory");

if (getListItems) {
    inventory.push(...JSON.parse(getListItems));
    renderListItems();
}