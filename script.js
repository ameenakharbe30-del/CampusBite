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

function addToCart(name, price, canteen) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    // Check if another canteen is already in cart

    if (cart.length > 0 && cart[0].canteen !== canteen) {

        showMessage(
            "Your cart contains items from " +
            cart[0].canteen +
            ". Please clear your cart before ordering from " +
            canteen + "."
        );

        return;
    }


    // Check if item already exists

    let item = cart.find(function(item) {

        return item.name === name;

    });


    if (item) {

        item.quantity = item.quantity + 1;

    } else {

        cart.push({

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

    showMessage(name + " added to cart");
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

function placeOrder() {

    let name =
        document.getElementById("name");


    let phone =
        document.getElementById("phone");


    let location =
        document.getElementById("location");


    let payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


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


    if (!payment) {

        showMessage(
            "Please select a payment method."
        );

        return;

    }


    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    if (cart.length === 0) {

        showMessage(
            "Your cart is empty."
        );

        return;

    }


    // Generate order ID

    let orderNumber =
        Math.floor(
            100 + Math.random() * 900
        );


    let orderId =
        "#" + orderNumber;


    // Save order

    let order = {

        orderId: orderId,

        name: name.value,

        phone: phone.value,

        location: location.value,

        payment: payment.value,

        canteen: cart[0].canteen,

        items: cart,

        total: cart.reduce(
            function(sum, item) {

                return sum +
                    Number(item.price) *
                    Number(item.quantity);

            },
            0
        ),

        date: new Date().toLocaleString()

    };


    let orders =
    JSON.parse(localStorage.getItem("orders")) || [];

orders.push(order);

localStorage.setItem(
    "orders",
    JSON.stringify(orders)
);

localStorage.setItem(
    "lastOrder",
    JSON.stringify(order)
);




    localStorage.setItem(
        "orderId",
        orderId
    );


    // Clear cart

    localStorage.removeItem("cart");


    updateCartCount();


    // Go to success page

    window.location.href =
        "order-success.html";
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














function showOrders() {

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let list =
        document.getElementById("orders-list");

    if (!list) {
        return;
    }


    if (orders.length === 0) {

        list.innerHTML = `

            <div class="empty-order">

                <h2>No orders yet</h2>

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


    orders.slice().reverse().forEach(function(order) {

        let items = "";


        order.items.forEach(function(item) {

            items += `
                <p>
                    ${item.name} × ${item.quantity}
                </p>
            `;

        });


        list.innerHTML += `

            <div class="order-box">

                <div class="order-top">

                    <div>

                        <span>Order ID</span>

                        <strong>
                            #${order.orderId}
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

}


if (document.getElementById("orders-list")) {

    showOrders();

}

