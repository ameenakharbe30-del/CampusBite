// ===============================
// LOAD GM WORKER ORDERS
// ===============================

async function loadWorkerOrders() {

    const container =
        document.getElementById("worker-orders");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/worker-orders/?canteen=GM%20College%20Canteen"
        );

        const orders =
            await response.json();

        console.log("GM Worker Orders:", orders);


        if (!response.ok) {

            throw new Error(
                orders.error || "Could not load orders"
            );

        }


        if (orders.length === 0) {

            container.innerHTML = `
                <div class="empty-order">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        New GM College Canteen orders will appear here.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML = "";


        orders.forEach(function(order) {

            let items = "";


            // ===============================
            // ORDER ITEMS
            // ===============================

            order.items.forEach(function(item) {

                items += `
                    <p>
                        ${item.name} × ${item.quantity}
                    </p>
                `;

            });


            // ===============================
            // STATUS BUTTON
            // ===============================

            let statusButton = "";


            if (order.status === "Order Placed") {

                statusButton = `
                    <button
                        class="status-button"
                        onclick="updateOrderStatus(${order.id}, 'Preparing')"
                    >
                        Accept Order
                    </button>
                `;

            }

            else if (order.status === "Preparing") {

                statusButton = `
                    <button
                        class="status-button"
                        onclick="updateOrderStatus(${order.id}, 'Ready')"
                    >
                        Mark Ready
                    </button>
                `;

            }

            else if (order.status === "Ready") {

                statusButton = `
                    <button
                        class="status-button"
                        onclick="updateOrderStatus(${order.id}, 'Completed')"
                    >
                        Mark Completed
                    </button>
                `;

            }

            else if (order.status === "Completed") {

                statusButton = `
                    <span class="completed-text">
                        ✓ Order Completed
                    </span>
                `;

            }

            else if (order.status === "Cancelled") {

                statusButton = `
                    <span class="cancelled-text">
                        Order Cancelled
                    </span>
                `;

            }


            // ===============================
            // ORDER CARD
            // ===============================

            container.innerHTML += `

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

                        <div>

                            <strong>
                                ${order.customer_name}
                            </strong>

                            <p>
                                ${order.phone}
                            </p>

                            <p>
                                Pickup:
                                ${order.location}
                            </p>

                            <p>
                                Payment:
                                ${order.payment}
                            </p>

                        </div>


                        <strong>
                            ₹${order.total}
                        </strong>

                    </div>


                    <div class="worker-actions">

                        ${statusButton}

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "GM Worker orders error:",
            error
        );


        container.innerHTML = `

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


// ===============================
// UPDATE ORDER STATUS
// ===============================

// ===============================
// UPDATE ORDER STATUS
// ===============================

async function updateOrderStatus(orderId, newStatus) {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/update-order-status/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    order_id: orderId,
                    status: newStatus
                })
            }
        );


        const result =
            await response.json();


        console.log(
            "GM Status update:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Could not update order"
            );

        }


        // Find the correct order card
        const cards =
            document.querySelectorAll(".order-box");


        cards.forEach(function(card) {

            const idElement =
                card.querySelector(".order-top strong");


            if (
                idElement &&
                idElement.textContent.trim() ===
                "#" + orderId
            ) {

                // Update status
                const statusElement =
                    card.querySelector(".status");

                if (statusElement) {

                    statusElement.textContent =
                        newStatus;

                }


                // Update button
                const actions =
                    card.querySelector(".worker-actions");


                if (actions) {

                    if (newStatus === "Preparing") {

                        actions.innerHTML = `
                            <button
                                class="status-button"
                                onclick="updateOrderStatus(${orderId}, 'Ready')"
                            >
                                Mark Ready
                            </button>
                        `;

                    }

                    else if (newStatus === "Ready") {

                        actions.innerHTML = `
                            <button
                                class="status-button"
                                onclick="updateOrderStatus(${orderId}, 'Completed')"
                            >
                                Mark Completed
                            </button>
                        `;

                    }

                    else if (newStatus === "Completed") {

                        actions.innerHTML = `
                            <span class="completed-text">
                                ✓ Order Completed
                            </span>
                        `;

                    }

                }

            }

        });


    } catch (error) {

        console.error(
            "GM Status update error:",
            error
        );

        alert(error.message);

    }

}

// ===============================
// START
// ===============================

loadWorkerOrders();