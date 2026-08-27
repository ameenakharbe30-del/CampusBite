from django.contrib import admin
from .models import Canteen, MenuItem, Order, OrderItem


@admin.register(Canteen)
class CanteenAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "canteen", "price", "available")
    list_filter = ("canteen", "available")
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "phone",
        "canteen",
        "total",
        "payment",
        "status",
        "created_at",
    )

    list_filter = ("canteen", "status", "payment")
    search_fields = ("customer_name", "phone")
    ordering = ("-created_at",)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "menu_item",
        "quantity",
        "price",
    )