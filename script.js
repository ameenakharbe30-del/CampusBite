// ===============================
// MESSAGE BOX
// ===============================

function showMessage(message) {
    let box = document.getElementById("message-box");

    if (!box) {
        box = document.createElement("div");
        box.id = "message-box";

        box.className =
            "fixed top-5 right-5 z-50 bg-gray-900 text-white " +
            "px-5 py-3 rounded-xl shadow-lg text-sm font-medium";

        document.body.appendChild(box);
    }

    box.textContent = message;
    box.style.display = "block";

    setTimeout(function () {
        box.style.display = "none";
    }, 3000);
}





// ===============================
// CART COUNT
// ===============================
// ===============================
// GET STUDENT CART KEY
// ===============================

function getCartKey() {
    const studentEmail = localStorage.getItem("studentEmail");

    if (!studentEmail) {
        return "cart";
    }

    return "cart_" + studentEmail.toLowerCase();
}


// ===============================
// UPDATE CART COUNT
// ===============================

function updateCartCount() {

    const cartKey = getCartKey();

    const cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];

    let count = 0;

    cart.forEach(function (item) {
        count += Number(item.quantity);
    });

    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id, name, price, canteen) {

    const cartKey = getCartKey();

    let cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];


    // Only one canteen per order
    if (
        cart.length > 0 &&
        cart[0].canteen !== canteen
    ) {
        showMessage(
            "You can only order from one canteen at a time."
        );
        return;
    }


    const existingItem =
        cart.find(function (item) {
            return item.id === id;
        });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: id,
            name: name,
            price: Number(price),
            quantity: 1,
            canteen: canteen
        });

    }


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    updateCartCount();

    showMessage(name + " added to cart");
}


// ===============================
// SHOW CART
// ===============================

function showCart() {

    const cartKey = getCartKey();

    let cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];


    const items =
        document.getElementById("cart-items");

    const total =
        document.getElementById("total");

    const subtotal =
        document.getElementById("subtotal");

    const count =
        document.getElementById("item-count");

    const cartCanteen =
        document.getElementById("cart-canteen");


    if (!items) {
        return;
    }


    // Remove invalid items
    cart = cart.filter(function (item) {

        return (
            item.name &&
            item.price !== undefined &&
            item.quantity > 0
        );

    });


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    // =========================
    // EMPTY CART
    // =========================

    if (cart.length === 0) {

        items.innerHTML = `
            <div class="bg-white border border-gray-200
                        rounded-2xl p-10 text-center">

                <div class="text-4xl mb-4">🛒</div>

                <h2 class="text-xl font-semibold text-gray-900">
                    Your cart is empty
                </h2>

                <p class="text-gray-500 mt-2">
                    Add some delicious food to get started.
                </p>

                <a href="index.html"
                   class="inline-block mt-5 bg-orange-500
                          hover:bg-orange-600 text-white
                          font-semibold px-6 py-3 rounded-xl">
                    Order Food
                </a>

            </div>
        `;


        if (total) {
            total.textContent = "0";
        }

        if (subtotal) {
            subtotal.textContent = "0";
        }

        if (count) {
            count.textContent = "0 items";
        }

        if (cartCanteen) {
            cartCanteen.textContent = "Canteen: -";
        }


        updateCartCount();

        return;
    }


    // =========================
    // CANTEEN
    // =========================

    if (cartCanteen) {

        cartCanteen.textContent =
            "Canteen: " + cart[0].canteen;

    }


    items.innerHTML = "";

    let amount = 0;
    let itemCount = 0;


    // =========================
    // ITEMS
    // =========================

    cart.forEach(function (item, index) {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        amount += itemTotal;

        itemCount += Number(item.quantity);


        items.innerHTML += `
            <div class="bg-white border border-gray-200
                        rounded-2xl p-5 shadow-sm
                        flex flex-col sm:flex-row
                        sm:items-center
                        sm:justify-between gap-5">

                <div>

                    <h3 class="text-lg font-semibold text-gray-900">
                        ${item.name}
                    </h3>

                    <p class="text-sm text-gray-500 mt-1">
                        ₹${Number(item.price).toFixed(2)} each
                    </p>

                </div>


                <div class="flex items-center gap-4">

                    <div class="flex items-center
                                border border-gray-300
                                rounded-xl overflow-hidden">

                        <button
                            onclick="minus(${index})"
                            class="px-4 py-2 text-lg
                                   hover:bg-gray-100">
                            −
                        </button>

                        <span class="px-4 font-semibold">
                            ${item.quantity}
                        </span>

                        <button
                            onclick="plus(${index})"
                            class="px-4 py-2 text-lg
                                   hover:bg-gray-100">
                            +
                        </button>

                    </div>


                    <span class="font-bold text-gray-900">
                        ₹${itemTotal.toFixed(2)}
                    </span>


                    <button
                        onclick="removeItem(${index})"
                        class="text-red-500 hover:text-red-600
                               text-sm font-medium">
                        Remove
                    </button>

                </div>

            </div>
        `;

    });


    if (subtotal) {
        subtotal.textContent =
            amount.toFixed(2);
    }

    if (total) {
        total.textContent =
            amount.toFixed(2);
    }

    if (count) {
        count.textContent =
            itemCount + " items";
    }


    updateCartCount();
}


// ===============================
// PLUS
// ===============================

function plus(index) {

    const cartKey = getCartKey();

    let cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];


    if (!cart[index]) {
        return;
    }


    cart[index].quantity++;


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    updateCartCount();

    showCart();
}


// ===============================
// MINUS
// ===============================

function minus(index) {

    const cartKey = getCartKey();

    let cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];


    if (!cart[index]) {
        return;
    }


    cart[index].quantity--;


    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    updateCartCount();

    showCart();
}


// ===============================
// REMOVE ITEM
// ===============================

function removeItem(index) {

    const cartKey = getCartKey();

    let cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];


    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    updateCartCount();

    showCart();
}


// ===============================
// CLEAR CART
// ===============================

function clearCart() {

    const cartKey = getCartKey();

    localStorage.removeItem(cartKey);


    updateCartCount();

    showCart();


    showMessage(
        "Cart cleared successfully"
    );
}


// ===============================
// GO TO CHECKOUT
// ===============================

function goToCheckout() {
    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        showMessage("Your cart is empty.");
        return;
    }

    window.location.href =
        "checkout.html";
}


// ===============================
// SHOW CHECKOUT
// ===============================

function showCheckout() {
    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const items =
        document.getElementById("checkout-items");

    const total =
        document.getElementById("checkout-total");

    const finalTotal =
        document.getElementById("final-total");

    if (!items) {
        return;
    }

    items.innerHTML = "";

    let amount = 0;

    if (cart.length === 0) {
        items.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500">
                    Your cart is empty.
                </p>

                <a href="index.html"
                   class="inline-block mt-4
                          bg-orange-500 hover:bg-orange-600
                          text-white font-semibold
                          px-5 py-2 rounded-xl">
                    Order Food
                </a>
            </div>
        `;

        if (total) {
            total.textContent = "0";
        }

        if (finalTotal) {
            finalTotal.textContent = "0";
        }

        return;
    }

    cart.forEach(function (item) {
        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        amount += itemTotal;

        items.innerHTML += `
            <div class="flex items-center
                        justify-between py-3
                        border-b border-gray-100">

                <span class="text-gray-700">
                    ${item.name} × ${item.quantity}
                </span>

                <span class="font-semibold text-gray-900">
                    ₹${itemTotal.toFixed(2)}
                </span>

            </div>
        `;
    });

    if (total) {
        total.textContent =
            amount.toFixed(2);
    }

    if (finalTotal) {
        finalTotal.textContent =
            amount.toFixed(2);
    }
}


// ===============================
// PLACE ORDER
// ===============================

async function placeOrder() {

    const name =
        document.getElementById("name");

    const phone =
        document.getElementById("phone");

    const location =
        document.getElementById("location");

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    // Check fields
    if (!name || !phone || !location) {
        return;
    }

    if (
        name.value.trim() === "" ||
        phone.value.trim() === "" ||
        location.value.trim() === ""
    ) {
        showMessage(
            "Please fill all the details."
        );
        return;
    }

    // Check payment
    if (!payment) {
        showMessage(
            "Please select a payment method."
        );
        return;
    }

    // Get cart
    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    if (cart.length === 0) {
        showMessage(
            "Your cart is empty."
        );
        return;
    }

    // Get canteen
    const canteen =
        cart[0].canteen;

    // Get logged-in student's email
    const studentEmail =
        localStorage.getItem("studentEmail");

    // Check student login
    if (!studentEmail) {
        showMessage(
            "Please login before placing an order."
        );
        return;
    }

    // Order data
    const orderData = {

        name:
            name.value.trim(),

        phone:
            phone.value.trim(),

        location:
            location.value.trim(),

        payment:
            payment.value,

        canteen:
            canteen,

        student_email:
            studentEmail,

        items:
            cart.map(function (item) {

                return {
                    id: item.id,
                    quantity: item.quantity
                };

            })
    };

    console.log(
        "Sending to Django:",
        orderData
    );

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/api/create-order/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );

        const result =
            await response.json();

        console.log(
            "Django response:",
            result
        );

        if (!response.ok) {

            showMessage(
                result.error ||
                "Failed to place order."
            );

            return;
        }

        // =========================
        // SAVE FRONTEND ORDER
        // =========================

        const order = {

            orderId:
                "#" + result.order_id,

            name:
                name.value.trim(),

            phone:
                phone.value.trim(),

            studentEmail:
                studentEmail,

            location:
                location.value.trim(),

            payment:
                payment.value,

            canteen:
                canteen,

            items:
                cart,

            total:
                result.total,

            status:
                result.status,

            date:
                new Date().toLocaleString()
        };

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(order)
        );

        // Save phone
        localStorage.setItem(
            "customerPhone",
            phone.value.trim()
        );

        // Clear cart
        localStorage.removeItem("cart");

        updateCartCount();

        // Go to order details
        window.location.href =
            "order-details.html";

    } catch (error) {

        console.error(
            "Connection error:",
            error
        );

        showMessage(
            "Cannot connect to Django server."
        );
    }
}


// ===============================
// SHOW ORDER ID
// ===============================
// ===============================
// SHOW ORDER DETAILS
// ===============================

function showOrderDetails() {
    const container = document.getElementById("order-items");

    if (!container) {
        return;
    }

    const lastOrder = JSON.parse(
        localStorage.getItem("lastOrder")
    );

    if (!lastOrder) {
        container.innerHTML = `
            <div class="text-center py-10">
                <p class="text-gray-500">
                    No order details available.
                </p>
            </div>
        `;
        return;
    }

    const items = lastOrder.items || [];

    let itemsHTML = "";

    items.forEach(function (item) {
        const itemTotal =
            Number(item.price) * Number(item.quantity);

        itemsHTML += `
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                    <p class="font-medium text-gray-900">
                        ${item.name}
                    </p>

                    <p class="text-sm text-gray-500">
                        Quantity: ${item.quantity}
                    </p>
                </div>

                <p class="font-semibold text-gray-900">
                    ₹${itemTotal.toFixed(2)}
                </p>
            </div>
        `;
    });

    container.innerHTML = itemsHTML;

    const orderId = document.getElementById("order-id");
    const orderStatus = document.getElementById("order-status");
    const orderTotal = document.getElementById("order-total");

    if (orderId) {
        orderId.textContent =
            lastOrder.orderId || "";
    }

    if (orderStatus) {
        orderStatus.textContent =
            lastOrder.status || "Order Placed";
    }

    if (orderTotal) {
        orderTotal.textContent =
            `₹${Number(lastOrder.total).toFixed(2)}`;
    }
}
// ===============================
// SHOW MY ORDERS
// ===============================

async function showOrders() {
    const list = document.getElementById("orders-list");

    if (!list) {
        return;
    }

    const studentEmail = localStorage.getItem("studentEmail");

    // Student is not logged in
    if (!studentEmail) {
        list.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                <div class="text-4xl mb-4">🔐</div>

                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    Please Login
                </h2>

                <p class="text-gray-500 mb-6">
                    Login to view your orders.
                </p>

                <a href="student-login.html"
                   class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl">
                    Student Login
                </a>
            </div>
        `;

        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/my-orders/?email=" +
            encodeURIComponent(studentEmail)
        );

        const orders = await response.json();

        if (!response.ok) {
            throw new Error(
                orders.error || "Could not load orders"
            );
        }

        // No orders
        if (!Array.isArray(orders) || orders.length === 0) {
            list.innerHTML = `
                <div class="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                    <div class="text-4xl mb-4">📋</div>

                    <h2 class="text-2xl font-bold text-gray-900 mb-2">
                        No orders yet
                    </h2>

                    <p class="text-gray-500 mb-6">
                        Your placed orders will appear here.
                    </p>

                    <a href="index.html"
                       class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl">
                        Order Food
                    </a>
                </div>
            `;

            return;
        }

        list.innerHTML = "";

        orders.forEach(function (order) {
            let itemsHTML = "";

            if (order.items && order.items.length > 0) {
                order.items.forEach(function (item) {
                    const itemTotal =
                        Number(item.price) * Number(item.quantity);

                    itemsHTML += `
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="text-gray-700">
                                ${item.name} × ${item.quantity}
                            </span>

                            <span class="font-medium text-gray-900">
                                ₹${itemTotal.toFixed(2)}
                            </span>
                        </div>
                    `;
                });
            }

            list.innerHTML += `
                <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    <div class="px-6 py-5 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <span class="text-xs uppercase tracking-wide text-gray-400">
                                Order ID
                            </span>

                            <h2 class="text-xl font-bold text-gray-900">
                                #${order.id}
                            </h2>
                        </div>

                        <span class="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                            ${order.status}
                        </span>

                    </div>

                    <div class="p-6">

                        <div class="mb-5">
                            <span class="text-xs uppercase tracking-wide text-gray-400">
                                Canteen
                            </span>

                            <p class="font-semibold text-gray-900 mt-1">
                                ${order.canteen}
                            </p>
                        </div>

                        <div class="mb-5">
                            <span class="text-xs uppercase tracking-wide text-gray-400">
                                Order Date
                            </span>

                            <p class="text-gray-700 mt-1">
                                ${order.created_at}
                            </p>
                        </div>

                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                            Items
                        </h3>

                        <div>
                            ${itemsHTML}
                        </div>

                    </div>

                    <div class="px-6 py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <span class="text-xs uppercase tracking-wide text-gray-400">
                                Total
                            </span>

                            <p class="text-2xl font-bold text-orange-600">
                                ₹${Number(order.total).toFixed(2)}
                            </p>
                        </div>

                        <a href="order-details.html"
                           class="text-orange-600 font-semibold hover:text-orange-700">
                            View Details →
                        </a>

                    </div>

                </div>
            `;
        });

    } catch (error) {
        console.error("Orders loading error:", error);

        list.innerHTML = `
            <div class="bg-white border border-red-200 rounded-2xl p-10 text-center shadow-sm">

                <div class="text-4xl mb-4">⚠️</div>

                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    Unable to load orders
                </h2>

                <p class="text-gray-500">
                    ${error.message}
                </p>

            </div>
        `;
    }
}


// ===============================
// RUN PAGE FUNCTIONS
// ===============================

updateCartCount();
showCart();
showCheckout();

if (document.getElementById("order-items")) {
    showOrderDetails();
}

if (document.getElementById("orders-list")) {
    showOrders();
}