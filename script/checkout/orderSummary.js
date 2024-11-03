import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../Utile/money.js';
// this is product day update link
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

// today date update checkout product work here
const today = dayjs();
const daliveryDate = today.add(7, 'days');


export function renderOrderSummary() {
    
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption = getDeliveryOption(deliveryOptionId);

        

        // Add a check to ensure deliveryOption is defined before accessing deliveryDays
        if (deliveryOption) {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );
            const dateString = deliveryDate.format('dddd, MMMM D');

            cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">Delivery date: ${dateString}</div>

                <div class="cart-item-details-grid">
                    <img
                    class="product-image"
                    src="${matchingProduct.image}"
                    />

                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                        <div class="product-quantity">
                            <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
                            <span class="update-quantity-link link-primary">Update</span>
                            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">Choose a delivery option:</div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>
            `;
        }
    });



    function deliveryOptionsHTML(matchingProduct, cartItem) {

        let html = '';

        // deliveryOptions.js theke forEash kore date update work
        deliveryOptions.forEach((deliveryOption) => {

            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );
            // dataString update date & use any place
            const dateString = deliveryDate.format('dddd, MMMM D');

            // PriceCents choise use condision this import topic
            const priceString = deliveryOption.priceCents === 0 
                ? 'FREE'
                : `$${formatCurrency(deliveryOption.priceCents)} -`;

            // radio checked
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html +=`<div class="delivery-option js-derivery-option" data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}"
            >
                <input
                type="radio"
                ${isChecked ? 'checked' : '' }
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}"
                />
                <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">FREE Shipping</div>
                </div>
                </div>
            `
        });

        return html;
    }


    // HTML showing all work

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


    // Delete quantity link here
    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', ()=> {
            const productId = link.dataset.productId;
            
            removeFromCart(productId);


            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            container.remove();

            renderPaymentSummary()
        });
    });
        

    document.querySelectorAll('.js-derivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {

                const {productId, deliveryOptionId} = element.dataset;

                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });
        });

}
