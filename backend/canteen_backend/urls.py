from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

from orders.views import (
    kmes_menu,
    gm_menu,
    create_order,
    my_orders,
    worker_orders,
    update_order_status,
    staff_login,
    student_login
)




def home(request):
    return JsonResponse({
        "message": "KMES Campus Canteen Backend is running!",
        "available_urls": [
            "/admin/",
            "/api/kmes-menu/",
            "/api/gm-menu/",
            "/api/create-order/",
            "/api/my-orders/",
            "/api/worker-orders/",
            "/api/update-order-status/"
        ]
    })


urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    path(
        "api/kmes-menu/",
        kmes_menu
    ),

    path(
        "api/gm-menu/",
        gm_menu
    ),

    path(
        "api/create-order/",
        create_order
    ),

    path(
        "api/my-orders/",
        my_orders
    ),

    path(
        "api/worker-orders/",
        worker_orders
    ),

    path(
        "api/update-order-status/",
        update_order_status
    ),

    path(
    "api/staff-login/",
    staff_login
),
    path(
    "api/student-login/",
    student_login
),

]