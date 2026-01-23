
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
    renderListItems();
    deleteListItem();
    productName.value = "";
    quantity.value = "";
    productName.focus();
}

function renderListItems() {
     inventoryList.innerHTML = "";
     inventory.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.quantity}`
        inventoryList.appendChild(li);
     })
}

function deleteListItem() {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Item"
    deleteBtn.addEventListener("click", () => {
        inventory.value = "";
    })
    inventoryList.appendChild(deleteBtn);
}