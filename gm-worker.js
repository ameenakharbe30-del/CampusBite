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


        // ===============================
        // NO ORDERS
        // ===============================

        if (orders.length === 0) {

            container.innerHTML = `

                <div class="bg-white
                            border border-gray-200
                            rounded-2xl
                            shadow-sm
                            p-10
                            text-center">

                    <div class="w-16 h-16
                                mx-auto mb-5
                                bg-orange-100
                                rounded-2xl
                                flex items-center justify-center
                                text-3xl">

                        📋

                    </div>

                    <h2 class="text-2xl
                               font-bold
                               text-gray-900
                               mb-2">

                        No orders yet

                    </h2>

                    <p class="text-gray-500">

                        New GM College Canteen orders
                        will appear here.

                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = "";


        // ===============================
        // DISPLAY ORDERS
        // ===============================

        orders.forEach(function(order) {

            let items = "";


            // ===============================
            // ORDER ITEMS
            // ===============================

            order.items.forEach(function(item) {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);

                items += `

                    <div class="flex items-center
                                justify-between
                                py-3
                                border-b border-gray-100
                                last:border-b-0">

                        <div>

                            <span class="font-medium
                                         text-gray-800">

                                ${item.name}

                            </span>

                            <span class="text-gray-500">

                                × ${item.quantity}

                            </span>

                        </div>

                        <strong class="text-gray-900">

                            ₹${itemTotal.toFixed(2)}

                        </strong>

                    </div>

                `;

            });


            // ===============================
            // STATUS STYLING
            // ===============================

            let statusClass = "";

            let statusIcon = "";


            if (order.status === "Order Placed") {

                statusClass =
                    "bg-orange-100 text-orange-700 border-orange-200";

                statusIcon = "🕐";

            }

            else if (order.status === "Preparing") {

                statusClass =
                    "bg-yellow-100 text-yellow-700 border-yellow-200";

                statusIcon = "👨‍🍳";

            }

            else if (order.status === "Ready") {

                statusClass =
                    "bg-green-100 text-green-700 border-green-200";

                statusIcon = "✓";

            }

            else if (order.status === "Completed") {

                statusClass =
                    "bg-blue-100 text-blue-700 border-blue-200";

                statusIcon = "✓";

            }

            else if (order.status === "Cancelled") {

                statusClass =
                    "bg-red-100 text-red-700 border-red-200";

                statusIcon = "✕";

            }



            // ===============================
            // STATUS BUTTON
            // ===============================

            let statusButton = "";


            if (order.status === "Order Placed") {

                statusButton = `

                    <button
                        class="w-full sm:w-auto
                               bg-orange-500
                               hover:bg-orange-600
                               text-white
                               font-semibold
                               px-6 py-3
                               rounded-xl
                               shadow-sm
                               hover:shadow-md
                               transition"
                        onclick="updateOrderStatus(
                            ${order.id},
                            'Preparing'
                        )">

                        Accept Order →

                    </button>

                `;

            }

            else if (order.status === "Preparing") {

                statusButton = `

                    <button
                        class="w-full sm:w-auto
                               bg-yellow-500
                               hover:bg-yellow-600
                               text-white
                               font-semibold
                               px-6 py-3
                               rounded-xl
                               shadow-sm
                               hover:shadow-md
                               transition"
                        onclick="updateOrderStatus(
                            ${order.id},
                            'Ready'
                        )">

                        Mark Ready →

                    </button>

                `;

            }

            else if (order.status === "Ready") {

                statusButton = `

                    <button
                        class="w-full sm:w-auto
                               bg-green-500
                               hover:bg-green-600
                               text-white
                               font-semibold
                               px-6 py-3
                               rounded-xl
                               shadow-sm
                               hover:shadow-md
                               transition"
                        onclick="updateOrderStatus(
                            ${order.id},
                            'Completed'
                        )">

                        Mark Completed ✓

                    </button>

                `;

            }

            else if (order.status === "Completed") {

                statusButton = `

                    <span class="inline-flex
                                 items-center
                                 gap-2
                                 bg-green-50
                                 text-green-700
                                 border border-green-200
                                 px-5 py-3
                                 rounded-xl
                                 font-semibold">

                        ✓ Order Completed

                    </span>

                `;

            }

            else if (order.status === "Cancelled") {

                statusButton = `

                    <span class="inline-flex
                                 items-center
                                 gap-2
                                 bg-red-50
                                 text-red-600
                                 border border-red-200
                                 px-5 py-3
                                 rounded-xl
                                 font-semibold">

                        ✕ Order Cancelled

                    </span>

                `;

            }



            // ===============================
            // ORDER CARD
            // ===============================

            container.innerHTML += `

                <div class="order-box
                            bg-white
                            border border-gray-200
                            rounded-2xl
                            shadow-sm
                            overflow-hidden
                            hover:shadow-md
                            transition">


                    <!-- =========================
                         ORDER HEADER
                    ========================== -->

                    <div class="order-top
                                px-6 py-5
                                bg-gray-50
                                border-b border-gray-200
                                flex flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-4">


                        <div>

                            <div class="flex items-center
                                        gap-2
                                        mb-1">

                                <span class="text-sm
                                             text-gray-500">

                                    Order ID

                                </span>

                                <strong class="text-lg
                                               text-gray-900">

                                    #${order.id}

                                </strong>

                            </div>

                            <p class="text-xs
                                      text-gray-400">

                                GM College Canteen Order

                            </p>

                        </div>


                        <!-- STATUS -->

                        <span class="status
                                     inline-flex
                                     items-center
                                     gap-2
                                     w-fit
                                     px-4 py-2
                                     rounded-full
                                     border
                                     text-sm
                                     font-semibold
                                     ${statusClass}">

                            <span>
                                ${statusIcon}
                            </span>

                            ${order.status}

                        </span>

                    </div>



                    <!-- =========================
                         ORDER BODY
                    ========================== -->

                    <div class="p-6">


                        <!-- Canteen -->

                        <div class="mb-6">

                            <p class="text-xs
                                      font-semibold
                                      uppercase
                                      tracking-wider
                                      text-gray-400
                                      mb-1">

                                Canteen

                            </p>

                            <h3 class="text-lg
                                       font-bold
                                       text-gray-900">

                                ${order.canteen}

                            </h3>

                        </div>



                        <!-- =========================
                             ITEMS
                        ========================== -->

                        <div class="mb-6">

                            <div class="flex items-center
                                        justify-between
                                        mb-3">

                                <h3 class="text-sm
                                           font-semibold
                                           uppercase
                                           tracking-wider
                                           text-gray-500">

                                    Items Ordered

                                </h3>

                                <span class="text-xs
                                             text-gray-400">

                                    ${order.items.length} item(s)

                                </span>

                            </div>


                            <div class="bg-gray-50
                                        rounded-xl
                                        px-4">

                                ${items}

                            </div>

                        </div>



                        <!-- =========================
                             CUSTOMER INFORMATION
                        ========================== -->

                        <div class="grid grid-cols-1
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                    gap-5
                                    pt-5
                                    border-t
                                    border-gray-200">


                            <!-- Customer -->

                            <div>

                                <p class="text-xs
                                          font-semibold
                                          uppercase
                                          tracking-wider
                                          text-gray-400
                                          mb-1">

                                    Customer

                                </p>

                                <p class="font-semibold
                                          text-gray-900">

                                    ${order.customer_name}

                                </p>

                            </div>



                            <!-- Phone -->

                            <div>

                                <p class="text-xs
                                          font-semibold
                                          uppercase
                                          tracking-wider
                                          text-gray-400
                                          mb-1">

                                    Phone

                                </p>

                                <p class="font-medium
                                          text-gray-700">

                                    ${order.phone}

                                </p>

                            </div>



                            <!-- Pickup -->

                            <div>

                                <p class="text-xs
                                          font-semibold
                                          uppercase
                                          tracking-wider
                                          text-gray-400
                                          mb-1">

                                    Pickup

                                </p>

                                <p class="font-medium
                                          text-gray-700">

                                    ${order.location}

                                </p>

                            </div>



                            <!-- Payment -->

                            <div>

                                <p class="text-xs
                                          font-semibold
                                          uppercase
                                          tracking-wider
                                          text-gray-400
                                          mb-1">

                                    Payment

                                </p>

                                <p class="font-medium
                                          text-gray-700">

                                    ${order.payment}

                                </p>

                            </div>


                        </div>

                    </div>



                    <!-- =========================
                         ORDER FOOTER
                    ========================== -->

                    <div class="px-6 py-5
                                bg-gray-50
                                border-t border-gray-200
                                flex flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-4">


                        <!-- Total -->

                        <div>

                            <p class="text-xs
                                      font-semibold
                                      uppercase
                                      tracking-wider
                                      text-gray-400
                                      mb-1">

                                Total Amount

                            </p>

                            <strong class="text-2xl
                                           font-bold
                                           text-orange-600">

                                ₹${Number(order.total).toFixed(2)}

                            </strong>

                        </div>



                        <!-- Action -->

                        <div class="worker-actions">

                            ${statusButton}

                        </div>


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

            <div class="bg-white
                        border border-red-200
                        rounded-2xl
                        shadow-sm
                        p-10
                        text-center">

                <div class="w-14 h-14
                            mx-auto mb-4
                            bg-red-100
                            rounded-xl
                            flex items-center justify-center
                            text-2xl">

                    ⚠️

                </div>

                <h2 class="text-2xl
                           font-bold
                           text-gray-900
                           mb-2">

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


        // ===============================
        // FIND CORRECT ORDER CARD
        // ===============================

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


                // ===============================
                // UPDATE STATUS
                // ===============================

                const statusElement =
                    card.querySelector(".status");


                if (statusElement) {

                    statusElement.textContent =
                        newStatus;

                }

                // UPDATE BUTTON
                // ===============================

                const actions =
                    card.querySelector(".worker-actions");


                if (actions) {

                    if (newStatus === "Preparing") {

                        actions.innerHTML = `

                            <button
                                class="w-full sm:w-auto
                                       bg-yellow-500
                                       hover:bg-yellow-600
                                       text-white
                                       font-semibold
                                       px-6 py-3
                                       rounded-xl
                                       shadow-sm
                                       hover:shadow-md
                                       transition"
                                onclick="updateOrderStatus(
                                    ${orderId},
                                    'Ready'
                                )">

                                Mark Ready →

                            </button>

                        `;

                    }

                    else if (newStatus === "Ready") {

                        actions.innerHTML = `

                            <button
                                class="w-full sm:w-auto
                                       bg-green-500
                                       hover:bg-green-600
                                       text-white
                                       font-semibold
                                       px-6 py-3
                                       rounded-xl
                                       shadow-sm
                                       hover:shadow-md
                                       transition"
                                onclick="updateOrderStatus(
                                    ${orderId},
                                    'Completed'
                                )">

                                Mark Completed ✓

                            </button>

                        `;

                    }

                    else if (newStatus === "Completed") {

                        actions.innerHTML = `

                            <span class="inline-flex
                                         items-center
                                         gap-2
                                         bg-green-50
                                         text-green-700
                                         border border-green-200
                                         px-5 py-3
                                         rounded-xl
                                         font-semibold">

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

// START


loadWorkerOrders();