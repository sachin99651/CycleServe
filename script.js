emailjs.init('EG69SQS4Vn9FeCpFO');

const servicesData = [
    { id: 1, name: "Dry Cleaning", price: 200, icon: "fas fa-tshirt" },
    { id: 2, name: "Wash & Fold", price: 100, icon: "fas fa-sync-alt" },
    { id: 3, name: "Ironing", price: 30, icon: "fas fa-tshirt" },
    { id: 4, name: "Stain Removal", price: 500, icon: "fas fa-spray-can" },
    { id: 5, name: "Leather Care", price: 999, icon: "fas fa-shoe-prints" },
    { id: 6, name: "Wedding Dress", price: 2800, icon: "fas fa-female" }
];

let cart = [];

const serviceListEl = document.getElementById('service-list');
const cartBodyEl = document.getElementById('cart-body');
const totalEl = document.getElementById('total-amount');
const bookBtn = document.getElementById('book-now-btn');
const msgBox = document.getElementById('msg-box');

const renderServices = () => {
    serviceListEl.innerHTML = servicesData.map(service => {
        const inCart = cart.some(item => item.id === service.id);
        return `
            <div class="service-row">
                <div class="s-info">
                    <i class="${service.icon}"></i> 
                    <b>${service.name}</b> 
                    <span class="s-price">₹${service.price}</span>
                </div>
                <button class="${inCart ? 'rmv-btn' : 'add-btn'}" data-id="${service.id}">
                    ${inCart ? '<i class="fas fa-minus"></i> Remove' : '<i class="fas fa-plus"></i> Add Item'}
                </button>
            </div>
        `;
    }).join('');
};

const updateCartDisplay = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = total;
    bookBtn.disabled = cart.length === 0;
    if (cart.length === 0) {
        cartBodyEl.innerHTML = '<tr><td colspan="3" class="empty-msg">Cart is empty</td></tr>';
        return;
    }
    cartBodyEl.innerHTML = cart.map((item, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
        </tr>
    `).join('');
};
const toggleItem = (id) => {
    const service = servicesData.find(s => s.id === id);
    const exists = cart.find(c => c.id === id);

    if (exists) {
        cart = cart.filter(c => c.id !== id); // Remove
    } else {
        cart.push(service);
    }
    
    renderServices();  
    updateCartDisplay();
};

serviceListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) toggleItem(parseInt(btn.dataset.id));
});

bookBtn.addEventListener('click', () => {
    const inputs = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    if (!inputs.name || !inputs.email || !inputs.phone) {
        msgBox.innerText = "Please fill all fields!";
        msgBox.style.color = "red";
        return;
    }

    const orderText = cart.map(i => `- ${i.name} (₹${i.price})`).join('\n');

    const params = {
        from_name: inputs.name,
        from_email: inputs.email,
        phone_number: inputs.phone,
        order_details: orderText,
        total_amount: totalEl.innerText
    };

    bookBtn.innerText = "Sending...";
    
    emailjs.send('service_fjgv2kn', 'template_dwlp7ou', params)
        .then(() => {
            msgBox.innerText = "Booking Confirmed!";
            msgBox.style.color = "green";
            cart = []; // Clear cart
            renderServices();
            updateCartDisplay();
            bookBtn.innerText = "Confirm Booking";
        })
        .catch((err) => {
            console.error(err);
            msgBox.innerText = "Error sending booking.";
            bookBtn.innerText = "Confirm Booking";
        });
});

renderServices();
updateCartDisplay();
