import json

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Canteen, MenuItem, Order, OrderItem


def kmes_menu(request):

    try:
        canteen = Canteen.objects.get(name="KMES Canteen")

        menu_items = canteen.menu_items.filter(available=True)

        data = []

        for item in menu_items:

            data.append({
                "id": item.id,
                "name": item.name,
                "price": float(item.price),
                "canteen": canteen.name
            })

        return JsonResponse(data, safe=False)

    except Canteen.DoesNotExist:

        return JsonResponse(
            {"error": "KMES Canteen not found"},
            status=404
        )




def gm_menu(request):

    try:

        canteen = Canteen.objects.get(
            name="GM College Canteen"
        )

        menu_items = canteen.menu_items.filter(
            available=True
        )

        data = []

        for item in menu_items:

            data.append({

                "id": item.id,

                "name": item.name,

                "price": float(item.price),

                "canteen": canteen.name

            })

        return JsonResponse(
            data,
            safe=False
        )


    except Canteen.DoesNotExist:

        return JsonResponse(
            {
                "error":
                "GM College Canteen not found"
            },
            status=404
        )






@csrf_exempt
def create_order(request):

    if request.method != "POST":

        return JsonResponse(
            {"error": "Only POST requests are allowed"},
            status=405
        )

    try:

        data = json.loads(request.body)

        name = data.get("name")
        phone = data.get("phone")
        student_email = data.get("student_email")
        location = data.get("location")
        payment = data.get("payment")
        canteen_name = data.get("canteen")
        items = data.get("items", [])


        # Check required details

        if not name or not phone or not location:

            return JsonResponse(
                {"error": "Please fill all details"},
                status=400
            )


        if not payment:

            return JsonResponse(
                {"error": "Please select payment method"},
                status=400
            )


        if not items:

            return JsonResponse(
                {"error": "Cart is empty"},
                status=400
            )


        # Find canteen

        canteen = Canteen.objects.get(
            name=canteen_name
        )


        # Create order

        order = Order.objects.create(

            customer_name=name,

            phone=phone,
            student_email=student_email,

            canteen=canteen,

            location=location,

            payment=payment,

            total=0

        )


        total = 0


        # Add items

        for item in items:

            menu_item = MenuItem.objects.get(
                id=item["id"]
            )

            quantity = int(
                item["quantity"]
            )

            price = menu_item.price

            total += price * quantity


            OrderItem.objects.create(

                order=order,

                menu_item=menu_item,

                quantity=quantity,

                price=price

            )


        # Update total

        order.total = total

        order.save()


        return JsonResponse({

            "success": True,

            "order_id": order.id,

            "status": order.status,

            "total": float(order.total)

        })


    except Canteen.DoesNotExist:

        return JsonResponse(
            {"error": "Canteen not found"},
            status=404
        )


    except MenuItem.DoesNotExist:

        return JsonResponse(
            {"error": "Menu item not found"},
            status=404
        )


    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500
        )






def my_orders(request):

    if request.method != "GET":

        return JsonResponse(
            {
                "error": "Only GET requests are allowed"
            },
            status=405
        )

    student_email = request.GET.get("email", "").strip().lower()

    if not student_email:

        return JsonResponse(
            {
                "error": "Student email is required"
            },
            status=400
        )

    orders = Order.objects.filter(
        student_email__iexact=student_email
    ).order_by("-created_at")

    data = []

    for order in orders:

        items = []

        for item in order.items.all():

            items.append({

                "name": item.menu_item.name,

                "quantity": item.quantity,

                "price": float(item.price)

            })

        data.append({

            "id": order.id,

            "customer_name": order.customer_name,

            "phone": order.phone,

            "student_email": order.student_email,

            "canteen": order.canteen.name,

            "location": order.location,

            "payment": order.payment,

            "status": order.status,

            "total": float(order.total),

            "created_at": order.created_at.strftime(
                "%d %b %Y, %I:%M %p"
            ),

            "items": items

        })

    return JsonResponse(
        data,
        safe=False
    )






# ===============================
# WORKER ORDERS
# ===============================

def worker_orders(request):

    if request.method != "GET":

        return JsonResponse(
            {
                "error": "Only GET requests are allowed"
            },
            status=405
        )

    # Get canteen from URL
    canteen_name = request.GET.get("canteen")

    if canteen_name:

        orders = Order.objects.filter(
            canteen__name=canteen_name
        ).order_by("-created_at")

    else:

        orders = Order.objects.all().order_by("-created_at")

    data = []

    for order in orders:

        items = []

        for item in order.items.all():

            items.append({

                "name": item.menu_item.name,

                "quantity": item.quantity,

                "price": float(item.price)

            })

        data.append({

            "id": order.id,

            "customer_name":
                order.customer_name,

            "phone":
                order.phone,

            "canteen":
                order.canteen.name,

            "location":
                order.location,

            "payment":
                order.payment,

            "status":
                order.status,

            "total":
                float(order.total),

            "created_at":
                order.created_at.strftime(
                    "%d %b %Y, %I:%M %p"
                ),

            "items":
                items

        })

    return JsonResponse(
        data,
        safe=False
    )








# ===============================
# UPDATE ORDER STATUS
# ===============================

@csrf_exempt
def update_order_status(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "error": "Only POST requests are allowed"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        order_id = data.get("order_id")
        status = data.get("status")


        # Check data

        if not order_id or not status:

            return JsonResponse(
                {
                    "error": "Order ID and status are required"
                },
                status=400
            )


        # Check valid status

        valid_statuses = [
            "Order Placed",
            "Preparing",
            "Ready",
            "Completed",
            "Cancelled"
        ]

        if status not in valid_statuses:

            return JsonResponse(
                {
                    "error": "Invalid order status"
                },
                status=400
            )


        # Find order

        order = Order.objects.get(
            id=order_id
        )


        # Update status

        order.status = status

        order.save()


        return JsonResponse({

            "success": True,

            "order_id": order.id,

            "status": order.status

        })


    except Order.DoesNotExist:

        return JsonResponse(
            {
                "error": "Order not found"
            },
            status=404
        )


    except Exception as e:

        return JsonResponse(
            {
                "error": str(e)
            },
            status=500
        )
    





# ===============================
# STAFF LOGIN
# ===============================

# ===============================
# STAFF LOGIN
# ===============================

@csrf_exempt
def staff_login(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed"},
            status=405
        )

    try:

        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        canteen_name = data.get("canteen")


        if not username or not password or not canteen_name:

            return JsonResponse(
                {"error": "Please fill all login details"},
                status=400
            )


        # ===============================
        # KMES STAFF
        # ===============================

        if (
            username == "kmes_staff"
            and password == "kmes123"
            and canteen_name == "KMES Canteen"
        ):

            return JsonResponse({

                "success": True,

                "canteen": "KMES Canteen",

                "redirect": "worker-home.html"

            })


        # ===============================
        # GM STAFF
        # ===============================

        if (
            username == "gm_staff"
            and password == "gm123"
            and canteen_name == "GM College Canteen"
        ):

            return JsonResponse({

                "success": True,

                "canteen": "GM College Canteen",

                "redirect": "gm-worker-home.html"

            })


        return JsonResponse(
            {"error": "Invalid username, password or canteen"},
            status=401
        )


    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500
        )






# ===============================
# STUDENT LOGIN
# ===============================

@csrf_exempt
def student_login(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        # Check that both fields are entered
        if not email or not password:
            return JsonResponse(
                {"error": "Please enter your email and password"},
                status=400
            )

        # Check if this email already exists
        user = User.objects.filter(email__iexact=email).first()

        # ---------------------------------
        # NEW STUDENT
        # ---------------------------------
        if user is None:

            # Create account automatically
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password
            )

            return JsonResponse({
                "success": True,
                "message": "Account created successfully",
                "email": email,
                "username": user.username,
                "redirect": "index.html"
            })

        # ---------------------------------
        # EXISTING STUDENT
        # ---------------------------------

        authenticated_user = authenticate(
            username=user.username,
            password=password
        )

        if authenticated_user is not None:

            return JsonResponse({
                "success": True,
                "message": "Login successful",
                "email": email,
                "username": user.username,
                "redirect": "index.html"
            })

        # Password doesn't match
        return JsonResponse(
            {"error": "Invalid password"},
            status=401
        )

    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500
        )