import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    console.log('>>> HERE')
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    console.log('>>> theKeyword', theKeyword)

    // If there is a different keyword than previous, then set thePageNumber to 1.
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginate(
      this.thePageNumber -1,
      this.thePageSize,
      theKeyword)
      .subscribe(this.processResult())

    // now search for the products using keyword
    // this.productService.searchProducts(theKeyword).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string and convert it to a number using the + symbol.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      // not category id available, default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    /*
     * Regarding the categoryId, we have to check if we have a different categoryId than the previous.

     * Angular will reuse a component if it's currently being viewed. So Angular may not always create 
       a new component every time, so there is a state from the previous call. 

     * About the page number or resetting the page number, if we have a different categoryId than the 
       previous, then we want to reset the page number back to one. And that's the rational for adding 
       this code. So if this.previousCategoryId is not equal to this.currentCategoryId, then 
       this.PageNumber is equal to one. */

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());

    // now get the products for the given category
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )
     
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

}