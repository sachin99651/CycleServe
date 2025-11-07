// script.js

// Initialize EmailJS with your Public Key
emailjs.init('EG69SQS4Vn9FeCpFO');

// 1. DATA
const services = [
    { id: 1, name: "Dry Cleaning", price: 200, icon: "fas fa-tshirt" },
    { id: 2, name: "Wash & Fold", price: 100, icon: "fas fa-sync-alt" },
    { id: 3, name: "Ironing", price: 30, icon: "fas fa-tshirt" },
    { id: 4, name: "Stain Removal", price: 500, icon: "fas fa-spray-can" },
    { id: 5, name: "Leather & Suede", price: 999, icon: "fas fa-shoe-prints" },
    { id: 6, name: "Wedding Dress", price: 2800, icon: "fas fa-female" }
];
let cart = [];

// This map connects your icons to emojis for the email
const serviceEmojiMap = {
    "fas fa-tshirt": "👕",
    "fas fa-sync-alt": "🧺",
    "fas fa-spray-can": "✨",
    "fas fa-shoe-prints": "👟",
    "fas fa-female": "👗"
};

// 2. DOM ELEMENTS
const serviceListContainer = document.getElementById('service-list-container');
const cartItemsTbody = document.getElementById('cart-items-tbody');
const totalAmountSpan = document.getElementById('total-amount');
const bookNowBtn = document.getElementById('book-now-btn');
const confirmationMessage = document.getElementById('confirmation-message');

// 3. FUNCTIONS
function renderServices() {
    serviceListContainer.innerHTML = '';
    services.forEach(service => {
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-item';

        // Check if the service is already in the cart
        const isInCart = cart.some(item => item.id === service.id);

        let buttonHtml;
        if (isInCart) {
            // If in cart, show ONLY the "Remove" button
            buttonHtml = `
                <button class="remove-btn" data-id="${service.id}">
                    <i class="fas fa-minus-circle"></i> Remove
                </button>
            `;
        } else {
            // If not in cart, show ONLY the "Add Item" button
            buttonHtml = `
                <button class="add-btn" data-id="${service.id}">
                    <i class="fas fa-plus-circle"></i> Add Item
                </button>
            `;
        }

        serviceDiv.innerHTML = `
            <div class="service-details">
                <i class="${service.icon}"></i> <h4>${service.name}</h4>
                <span class="service-price">₹${service.price}</span>
            </div>
            <div class="service-actions">
                ${buttonHtml}
            </div>
        `;
        serviceListContainer.appendChild(serviceDiv);
    });

    const infoP = document.createElement('p');
    infoP.className = 'add-cart-info';
    infoP.innerHTML = `<i class="fas fa-info-circle"></i> Add items to the cart and book now.`;
    serviceListContainer.appendChild(infoP);
}

function updateCart() {
    cartItemsTbody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsTbody.innerHTML = '<tr class="cart-empty-message"><td colspan="3">No items added yet.</td></tr>';
        bookNowBtn.disabled = true; // Disable button if cart is empty
    } else {
        cart.forEach((item, index) => {
            const row = cartItemsTbody.insertRow();
            row.innerHTML = `<td>${index + 1}</td><td>${item.name}</td><td>₹${item.price}</td>`;
            total += item.price;
        });
        bookNowBtn.disabled = false; // Enable button if cart has items
    }
    totalAmountSpan.innerText = total;
}

function addToCart(serviceId) {
    if (cart.some(item => item.id === serviceId)) return;
    const serviceToAdd = services.find(s => s.id === serviceId);
    if (serviceToAdd) {
        cart.push(serviceToAdd);
        updateCart();
        renderServices();
    }
}

function removeFromCart(serviceId) {
    cart = cart.filter(item => item.id !== serviceId);
    updateCart();
    renderServices();
}

// 4. EVENT LISTENERS
serviceListContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const serviceId = parseInt(button.dataset.id);

    if (button.classList.contains('add-btn')) {
        addToCart(serviceId);
    } else if (button.classList.contains('remove-btn')) {
        removeFromCart(serviceId);
    }
});

bookNowBtn.addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const totalAmount = totalAmountSpan.innerText;

    if (!fullName || !email || !phone) {
        confirmationMessage.innerText = "Please fill in all booking details.";
        confirmationMessage.style.color = 'red';
        return;
    }

    // Create the order details with emojis
    const orderDetails = cart.map(item => {
        const emoji = serviceEmojiMap[item.icon] || '✅';
        return `${emoji} ${item.name} (₹${item.price})`;
    }).join('\n');

    const templateParams = {
        from_name: fullName,
        from_email: email,
        phone_number: phone,
        order_details: orderDetails,
        total_amount: totalAmount
    };

    // Send the email
   // Change this line:
    emailjs.send('service_fjgv2kn', 'template_dwlp7ou', templateParams) 
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
           confirmationMessage.innerText = "Thank you! We've received your booking.";
           confirmationMessage.style.color = '#22C5C4';
           cart = [];
           updateCart();
           renderServices();
           document.getElementById('fullName').value = '';
           document.getElementById('email').value = '';
           document.getElementById('phone').value = '';
        }, function(error) {
           console.log('EMAILJS FAILED...', error);
           confirmationMessage.innerText = "Failed to send booking. Please try again.";
           confirmationMessage.style.color = 'red';
        });
});

// 5. INITIALIZE THE PAGE
window.onload = () => {
    renderServices();
    updateCart();
};