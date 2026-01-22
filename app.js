const productName = document.getElementById("product-name");
const quantity = document.getElementById("quantity");
const form = document.getElementById("inventory-form");



function handleFormData(e) {
    e.preventDefault();
    const productNameData = productName.value;
    const quantityData = Number(quantity.value); 
    if (productNameData.trim() === "") {
        return;
    }
    if (quantityData < 0 || Number.isNaN(quantityData)) {
        return;
    }
}
form.addEventListener("submit", handleFormData);
