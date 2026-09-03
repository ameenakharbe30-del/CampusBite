// ===============================
// MESSAGE BOX
// ===============================

function showMessage(message) {

    let box = document.getElementById("message-box");

    if (!box) {

        box = document.createElement("div");

        box.id = "message-box";

        document.body.appendChild(box);
    }

    box.textContent = message;

    box.style.display = "block";

    setTimeout(function() {

        box.style.display = "none";

    }, 3000);
}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(function(item) {

        count = count + Number(item.quantity);

    });

    let cartCount = document.getElementById("cart-count");

    if (cartCount) {

        cartCount.textContent = count;

    }
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id, name, price, canteen) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Only one canteen per order
    if (cart.length > 0 && cart[0].canteen !== canteen) {

        showMessage(
            "You can only order from one canteen at a time."
        );

        return;
    }

    // Check if item already exists
    let existingItem = cart.find(function(item) {
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
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showMessage(
        name + " added to cart"
    );
}


// ===============================
// SHOW CART
// ===============================

function showCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let items = document.getElementById("cart-items");

    let total = document.getElementById("total");

    let subtotal = document.getElementById("subtotal");

    let count = document.getElementById("item-count");

    let cartCanteen = document.getElementById("cart-canteen");


    // Not cart page

    if (!items) {

        return;

    }


    // Remove invalid items

    cart = cart.filter(function(item) {

        return item.name &&
               item.price !== undefined &&
               item.quantity > 0;

    });


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // EMPTY CART

    if (cart.length === 0) {

        items.innerHTML = `
            <p class="empty">
                Your cart is empty.
            </p>
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


    // SHOW CANTEEN

    if (cartCanteen) {

        cartCanteen.textContent =
            "Canteen: " + cart[0].canteen;

    }


    items.innerHTML = "";

    let amount = 0;

    let itemCount = 0;


    // SHOW ITEMS

    cart.forEach(function(item, index) {

        let itemTotal =
            Number(item.price) *
            Number(item.quantity);


        amount = amount + itemTotal;

        itemCount =
            itemCount + Number(item.quantity);


        items.innerHTML += `

            <div class="item">

                <div class="item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price} each
                    </p>

                </div>


                <div class="item-right">


                    <div class="quantity">

                        <button
                            onclick="minus(${index})">

                            −

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            onclick="plus(${index})">

                            +

                        </button>

                    </div>


                    <span class="price">

                        ₹${itemTotal}

                    </span>


                    <button
                        class="remove"
                        onclick="removeItem(${index})">

                        Remove

                    </button>


                </div>

            </div>

        `;
    });


    if (subtotal) {

        subtotal.textContent = amount;

    }


    if (total) {

        total.textContent = amount;

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

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        cart[index].quantity + 1;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showCart();
}


// ===============================
// MINUS
// ===============================

function minus(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        cart[index].quantity - 1;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showCart();
}


// ===============================
// REMOVE ITEM
// ===============================

function removeItem(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    if (!cart[index]) {

        return;

    }


    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    showCart();
}


// ===============================
// CLEAR CART
// ===============================

function clearCart() {

    localStorage.removeItem("cart");

    updateCartCount();

    showCart();

    showMessage("Cart cleared successfully");
}


// ===============================
// GO TO CHECKOUT
// ===============================

function goToCheckout() {

    let cart =
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

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    let items =
        document.getElementById("checkout-items");


    let total =
        document.getElementById("checkout-total");


    let finalTotal =
        document.getElementById("final-total");


    if (!items) {

        return;

    }


    items.innerHTML = "";

    let amount = 0;


    if (cart.length === 0) {

        items.innerHTML = `
            <p class="empty">
                Your cart is empty.
            </p>
        `;

        if (total) {

            total.textContent = "0";

        }

        if (finalTotal) {

            finalTotal.textContent = "0";

        }

        return;

    }


    cart.forEach(function(item) {

        let itemTotal =
            Number(item.price) *
            Number(item.quantity);


        amount = amount + itemTotal;


        items.innerHTML += `

            <div class="checkout-item">

                <span class="checkout-item-name">

                    ${item.name} × ${item.quantity}

                </span>


                <span class="checkout-item-price">

                    ₹${itemTotal}

                </span>

            </div>

        `;

    });


    if (total) {

        total.textContent = amount;

    }


    if (finalTotal) {

        finalTotal.textContent = amount;

    }
}


// ===============================
// PLACE ORDER
// ===============================
async function placeOrder() {

    let name = document.getElementById("name");
    let phone = document.getElementById("phone");
    let location = document.getElementById("location");

    let payment = document.querySelector(
        'input[name="payment"]:checked'
    );


    // =========================
    // CHECK INPUT FIELDS
    // =========================

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


    // =========================
    // CHECK PAYMENT
    // =========================

    if (!payment) {

        showMessage(
            "Please select a payment method."
        );

        return;
    }


    // =========================
    // GET CART
    // =========================

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    console.log("Cart:", cart);


    if (cart.length === 0) {

        showMessage(
            "Your cart is empty."
        );

        return;
    }


    // =========================
    // GET CANTEEN
    // =========================

    let canteen =
        cart[0].canteen;


    console.log(
        "Canteen:",
        canteen
    );


    // =========================
    // CONVERT PAYMENT
    // =========================

let paymentValue = payment.value;

    // =========================
    // CREATE DATA FOR DJANGO
    // =========================

    let orderData = {

        name: name.value.trim(),

        phone: phone.value.trim(),

        location: location.value,

        payment: paymentValue,

        canteen: canteen,

        items: cart.map(function(item) {

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


    // =========================
    // SEND ORDER TO DJANGO
    // =========================

    try {

        let response = await fetch(
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


        let result =
            await response.json();


        console.log(
            "Django response:",
            result
        );


        // =========================
        // CHECK DJANGO RESPONSE
        // =========================

        if (!response.ok) {

            showMessage(
                result.error ||
                "Failed to place order."
            );

            return;
        }


        // =========================
        // CREATE FRONTEND ORDER
        // =========================

let order = {

    orderId:
        "#" + result.order_id,

    name:
        name.value.trim(),

    phone:
        phone.value.trim(),

    location:
        location.value,

    payment:
        paymentValue,

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


// SAVE ORDER
localStorage.setItem(
    "lastOrder",
    JSON.stringify(order)
);


// SAVE CUSTOMER PHONE
localStorage.setItem(
    "customerPhone",
    phone.value.trim()
);


// CLEAR CART
localStorage.removeItem("cart");

updateCartCount();


// GO TO ORDER DETAILS
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

function showOrderId() {

    let orderId =
        localStorage.getItem("orderId");


    let element =
        document.getElementById("order-id");


    if (element && orderId) {

        element.textContent =
            orderId;

    }
}


// ===============================
// VIEW ORDER
// ===============================

function viewOrder() {

    window.location.href =
        "order-details.html";
}


// ===============================
// RUN FUNCTIONS
// ===============================

updateCartCount();

showCart();

showCheckout();

showOrderId();
















/* ---------- Show Order Details ---------- */

function showOrderDetails() {

    let order = JSON.parse(
        localStorage.getItem("lastOrder")
    );

    if (!order) {
        return;
    }

    // Order information

    document.getElementById("order-id").textContent =
        order.orderId;

    document.getElementById("canteen").textContent =
        order.canteen;

document.getElementById("customer").textContent =
    order.name;

    document.getElementById("phone").textContent =
        order.phone;

    document.getElementById("order-type").textContent =
        order.location;

    document.getElementById("payment").textContent =
        order.payment;


    // Items

    let items =
        document.getElementById("order-items");

    items.innerHTML = "";

    let total = 0;


    order.items.forEach(function(item) {

        let itemTotal =
            Number(item.price) *
            Number(item.quantity);

        total = total + itemTotal;


        items.innerHTML += `

            <div class="order-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <strong>
                    ₹${itemTotal}
                </strong>

            </div>

        `;
    });


    // Total

    document.getElementById("order-total").textContent =
        total;
}


// Run on order details page

if (document.getElementById("order-items")) {
    showOrderDetails();
}















async function showOrders() {

    const list =
        document.getElementById("orders-list");

    if (!list) {
        return;
    }


    // Get phone number saved when order was placed
    const phone =
        localStorage.getItem("customerPhone");


    console.log("Customer phone:", phone);


    if (!phone) {

        list.innerHTML = `
            <div class="empty-order">

                <h2>
                    No customer information found
                </h2>

                <p>
                    Please place an order first.
                </p>

                <a href="index.html">
                    Order Food
                </a>

            </div>
        `;

        return;
    }


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/my-orders/?phone="
            + encodeURIComponent(phone)
        );


        const orders =
            await response.json();


        console.log(
            "DJANGO ORDERS:",
            orders
        );


        if (!response.ok) {

            throw new Error(
                orders.error ||
                "Could not load orders"
            );

        }


        if (
            !Array.isArray(orders) ||
            orders.length === 0
        ) {

            list.innerHTML = `
                <div class="empty-order">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Your placed orders will appear here.
                    </p>

                    <a href="index.html">
                        Order Food
                    </a>

                </div>
            `;

            return;
        }


        list.innerHTML = "";


        orders.forEach(function(order) {

            let items = "";


            if (
                order.items &&
                order.items.length > 0
            ) {

                order.items.forEach(function(item) {

                    items += `
                        <p>
                            ${item.name}
                            × ${item.quantity}
                        </p>
                    `;

                });

            } else {

                items = `
                    <p>
                        No items found.
                    </p>
                `;

            }


            list.innerHTML += `

                <div class="order-box">

                    <div class="order-top">

                        <div>

                            <span>
                                Order ID
                            </span>

                            <strong>
                                #${order.id}
                            </strong>

                        </div>


                        <span class="status">
                            ${order.status}
                        </span>

                    </div>


                    <div class="order-canteen">

                        <strong>
                            ${order.canteen}
                        </strong>

                    </div>


                    <div class="order-items">

                        ${items}

                    </div>


                    <div class="order-bottom">

                        <strong>
                            ₹${order.total}
                        </strong>


                        <a href="order-details.html">
                            View Details
                        </a>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Orders loading error:",
            error
        );


        list.innerHTML = `
            <div class="empty-order">

                <h2>
                    Unable to load orders
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

    }

}


if (document.getElementById("orders-list")) {

    showOrders();

}

















