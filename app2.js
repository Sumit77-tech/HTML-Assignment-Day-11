// DOM Elements
const loginSection = document.getElementById('login-section');
const cartSection = document.getElementById('cart-section');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');
const userNameDisplay = document.getElementById('user-name');
const addItemBtn = document.getElementById('add-item-btn');
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const itemQuantityInput = document.getElementById('item-quantity');
const cartTable = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
const totalCostDisplay = document.getElementById('total-cost');
const logoutBtn = document.getElementById('logout-btn');

let currentUser = null;

// Login Functionality
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username === '') {
    errorMessage.textContent = 'Username cannot be empty.';
    return;
  }

  // Check if user exists in localStorage
  const storedData = JSON.parse(localStorage.getItem(username));
  if (storedData) {
    currentUser = username;
    loadCart();
  } else {
    errorMessage.textContent = 'Username does not exist. Please try again.';
  }
});

// Load User's Cart from localStorage
function loadCart() {
  loginSection.style.display = 'none';
  cartSection.style.display = 'block';
  userNameDisplay.textContent = currentUser;

  // Load cart items from localStorage
  const cartData = JSON.parse(localStorage.getItem(currentUser)) || [];
  updateCartDisplay(cartData);
}

// Add Item to Cart
addItemBtn.addEventListener('click', () => {
  const itemName = itemNameInput.value.trim();
  const itemPrice = parseFloat(itemPriceInput.value.trim());
  const itemQuantity = parseInt(itemQuantityInput.value.trim());

  if (itemName === '' || isNaN(itemPrice) || isNaN(itemQuantity) || itemQuantity <= 0 || itemPrice <= 0) {
    alert('Please provide valid item details.');
    return;
  }

  // Get existing cart or initialize empty cart
  const cartData = JSON.parse(localStorage.getItem(currentUser)) || [];

  // Check if item already exists
  const existingItem = cartData.find(item => item.itemName === itemName);
  if (existingItem) {
    // Update quantity and total cost
    existingItem.quantity += itemQuantity;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    // Add new item
    cartData.push({
      itemName: itemName,
      price: itemPrice,
      quantity: itemQuantity,
      total: itemPrice * itemQuantity
    });
  }

  // Save updated cart
  localStorage.setItem(currentUser, JSON.stringify(cartData));

  // Update cart display
  updateCartDisplay(cartData);

  // Clear input fields
  itemNameInput.value = '';
  itemPriceInput.value = '';
  itemQuantityInput.value = '';
});

// Update Cart Display
function updateCartDisplay(cartData) {
  cartTable.innerHTML = '';
  let totalCost = 0;

  cartData.forEach((item, index) => {
    const row = cartTable.insertRow();
    row.innerHTML = `
      <td>${item.itemName}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><input type="number" value="${item.quantity}" data-index="${index}" class="quantity-input" /></td>
      <td>$${item.total.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${index}">Remove</button></td>
    `;

    totalCost += item.total;
  });

  totalCostDisplay.textContent = totalCost.toFixed(2);

  // Add event listeners for quantity update and remove
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', updateQuantity);
  });
  
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', removeItem);
  });
}

// Update Item Quantity
function updateQuantity(event) {
  const index = event.target.getAttribute('data-index');
  const newQuantity = parseInt(event.target.value);
  
  if (newQuantity <= 0) return;

  const cartData = JSON.parse(localStorage.getItem(currentUser));
  cartData[index].quantity = newQuantity;
  cartData[index].total = cartData[index].price * newQuantity;

  localStorage.setItem(currentUser, JSON.stringify(cartData));

  updateCartDisplay(cartData);
}

// Remove Item from Cart
function removeItem(event) {
  const index = event.target.getAttribute('data-index');

  const cartData = JSON.parse(localStorage.getItem(currentUser));
  cartData.splice(index, 1);

  localStorage.setItem(currentUser, JSON.stringify(cartData));

  updateCartDisplay(cartData);
}

// Logout
logoutBtn.addEventListener('click', () => {
  loginSection.style.display = 'block';
  cartSection.style.display = 'none';
  currentUser = null;
  usernameInput.value = '';
});
