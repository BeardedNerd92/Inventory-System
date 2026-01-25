const productName = document.getElementById("product-name");
const quantity = document.getElementById("quantity");
const form = document.getElementById("inventory-form");
const inventoryList = document.getElementById("inventory-list")
const LOW_STOCK_THRESHOLD = 3;

form.addEventListener("submit", handleFormData);
const inventory = [];


function handleFormData(e) {
    e.preventDefault();
    const productNameData = productName.value.trim();
    const quantityData = Number(quantity.value); 
    if (productNameData === "") {
        return;
    }
    if (quantityData < 0  || !Number.isInteger(quantityData)) {
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

function applyLowStockThreshHold(item, text, li) {
    if (item.quantity <= LOW_STOCK_THRESHOLD) {
        text.textContent += " - ⚠️ Low stock warning!";
        li.classList.add("low-stock");
    }
}

function renderListItems() {
    inventoryList.innerHTML = "";
    if (!inventory.length) {
         inventoryList.textContent = "No Inventory";
         return;
    }
     inventory.forEach((item, index) => {
         const li = document.createElement("li");
         const text = document.createElement("span");
         const deleteBtn = document.createElement("button");
         
        text.textContent = `${item.name} - ${item.quantity}`
        applyLowStockThreshHold(item, text, li);
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