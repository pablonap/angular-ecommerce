import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    this.cartService.computeCartTotals();
     
  }

  incrementQuantity(theCartItem) {
    // I am updating cartItems from cartService an in turn, in this html I'm iterating that array.
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
  }

}
