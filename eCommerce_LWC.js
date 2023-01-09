/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
import { LightningElement, track, wire, api } from 'lwc';
import getAllItems from '@salesforce/apex/LWC_eCommerce_Controller.getAllItems';
import OTPSender from '@salesforce/apex/LWC_eCommerce_Controller.OTPSender';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class ECommerce_LWC extends LightningElement {


    @track itemsList = [];
    currentItem;
    currentOriginalPrice;
    TotalAmt;
    quantity = 1;
    homePage = true;
    viewPage = false;
    buyPage = false;
    checkOutPage = false;
    cardmode = false;
    upimode = false;
    div2 = false;
    shipAdd = true;
    optionsMon = [];
    optionsYear = [];
    OTPTruthy = false;
    OTP;
    NOTP;
    gift = false;
    cardType;
    salutationOptions = [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' }
    ];
    optionsPayMode = [
        { label: 'Card', value: 'card' },
        { label: 'UPI', value: 'upi' }
    ]
    upiId = '8870300949@ybl';
    qrCodeUrl;
    @track valueMon = '';
    @track valueYear = '';



    connectedCallback(){
        for (let i = 1; i < 13; i++) {
            let j = i;
            const opt = {
                label: i,
                value: j
            };
            this.optionsMon.push(opt);
        }
        for (let i = 2023; i < 2040; i++) {
            const opt = {
                label: i,
                value: i
            };
            this.optionsYear.push(opt);
        }
    }

    @wire(getAllItems)
    getItems({error, data}){
        if(data){
            this.itemsList = data;
            data.forEach(element => {
                console.log(element);
            });
        }
        else if(error){
            alert(JSON.stringify(error));
        }
    }

    viewItem(event){
        this.homePage = false;
        this.currentItem = this.itemsList.find(obj => obj.Id == event.target.name);
        this.currentOriginalPrice = (parseFloat(this.currentItem.Amount__c) * 1.3).toFixed(2);
        this.viewPage = true;
        
    }

    buyNowHandle(){
        this.homePage = false;
        this.viewPage = false;
        this.buyPage = true;
        this.quantity = this.template.querySelector('lightning-slider').value;
        this.TotalAmt = (this.quantity * parseFloat(this.currentItem.Amount__c) * 1.18).toFixed(2);
    }

    handleCancel(){
        this.quantity = 1;
        this.homePage = true;
        this.viewPage = false;
        this.buyPage = false;
        this.checkOutPage = false;
        this.cardmode = false;
        this.upimode = false;
        this.div2 = false;
    }

    handleBack(){
        this.homePage = false;
        this.viewPage = true;
        this.buyPage = false;
        this.checkOutPage = false;
    }

    handleCheckboxChange(event){
        this.shipAdd = event.target.checked;
        if(this.template.querySelector('lightning-input[data-id="checkbox"]').checked == true ){
            this.addressOnblur();
        }
        else{
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').salutation = '';
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').firstName = '';
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').lastName = '';
            this.template.querySelector('lightning-input-address[data-id="shipping"]').street = '';
            this.template.querySelector('lightning-input-address[data-id="shipping"]').city = '';
            this.template.querySelector('lightning-input-address[data-id="shipping"]').province = '';
            this.template.querySelector('lightning-input-address[data-id="shipping"]').country = '';
            this.template.querySelector('lightning-input-address[data-id="shipping"]').postalCode = '';
        }
    }

    addressOnblur(){
        if(this.template.querySelector('lightning-input[data-id="checkbox"]').checked == true ){
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').salutation = this.template.querySelector('lightning-input-name[data-id="billingname"]').salutation;
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').firstName = this.template.querySelector('lightning-input-name[data-id="billingname"]').firstName;
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').lastName = this.template.querySelector('lightning-input-name[data-id="billingname"]').lastName;
            this.template.querySelector('lightning-input-address[data-id="shipping"]').street = this.template.querySelector('lightning-input-address[data-id="billing"]').street;
            this.template.querySelector('lightning-input-address[data-id="shipping"]').city = this.template.querySelector('lightning-input-address[data-id="billing"]').city;
            this.template.querySelector('lightning-input-address[data-id="shipping"]').province = this.template.querySelector('lightning-input-address[data-id="billing"]').province;
            this.template.querySelector('lightning-input-address[data-id="shipping"]').country = this.template.querySelector('lightning-input-address[data-id="billing"]').country;
            this.template.querySelector('lightning-input-address[data-id="shipping"]').postalCode = this.template.querySelector('lightning-input-address[data-id="billing"]').postalCode;
        }
    }   

    handleCheckOut(){
        if(
            this.template.querySelector('lightning-input-name[data-id="billingname"]').firstName == '' ||
            this.template.querySelector('lightning-input-name[data-id="billingname"]').lastName == '' ||
            this.template.querySelector('lightning-input-address[data-id="billing"]').street == '' ||
            this.template.querySelector('lightning-input-address[data-id="billing"]').city == '' ||
            this.template.querySelector('lightning-input-address[data-id="billing"]').province == '' ||
            this.template.querySelector('lightning-input-address[data-id="billing"]').country == '' ||
            this.template.querySelector('lightning-input-address[data-id="billing"]').postalCode == '' ||
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').firstName == '' ||
            this.template.querySelector('lightning-input-name[data-id="shippingname"]').lastName == '' ||
            this.template.querySelector('lightning-input-address[data-id="shipping"]').street == '' ||
            this.template.querySelector('lightning-input-address[data-id="shipping"]').city == '' ||
            this.template.querySelector('lightning-input-address[data-id="shipping"]').province == '' ||
            this.template.querySelector('lightning-input-address[data-id="shipping"]').country == '' ||
            this.template.querySelector('lightning-input-address[data-id="shipping"]').postalCode == ''
        ){
            const event = new ShowToastEvent({
                title: 'Error!',
                message: 'Entered all the details to proceed further.',
                variant: 'error'
            });
            this.dispatchEvent(event);

        }
        else{
            this.homePage = false;
            this.viewPage = false;
            this.buyPage = false;
            this.checkOutPage = true;
        }

    }

    getCardType() {
        let cardNumber = this.template.querySelector('lightning-input[data-id="card"]');
        if (/^5[1-5]/.test(cardNumber)) {
            this.cardType = 'Mastercard';
        } else if (/^4/.test(cardNumber)) {
            this.cardType = 'Visa';
        } else if (/^3[47]/.test(cardNumber)) {
            this.cardType = 'American Express';
        } else if (/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/.test(cardNumber)) {
            this.cardType = 'Discover';
        }
        this.cardType = '';
      }

    handlePaymentMethod(){
        this.div2 = true;
        if (this.template.querySelector('lightning-radio-group[data-id="paymentMode"]').value == 'card') {
            this.cardmode = true;
            this.upimode = false;
        }
        else if (this.template.querySelector('lightning-radio-group[data-id="paymentMode"]').value == 'upi') {
            this.upimode = true;
            this.cardmode = false;
            
            const upiString = "upi://pay?pa="+ this.upiId +"&pn=Amazon&am="+ this.TotalAmt +"&cu=INR";
            // Encode the UPI string as a URL parameter
            const encodedUPI = encodeURIComponent(upiString);
            // Set the size of the QR code
            const size = 200;
            // Create the QR code image URL
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUPI}&size=${size}x${size}`;
            this.qrCodeUrl = qrUrl;
            console.log(this.qrCodeUrl);


        }
    }

    handleSendOTP(){
        if(
            this.template.querySelector('lightning-input[data-id="email"]').value == '' ||
            this.template.querySelector('lightning-input[data-id="card"]').value == '' ||
            this.template.querySelector('lightning-combobox[data-id="month"]').value == '' ||
            this.template.querySelector('lightning-combobox[data-id="year"]').value == ''
            ){
                const event = new ShowToastEvent({
                    title: 'Error!',
                    message: 'Entered all the details to proceed further.',
                    variant: 'error'
                });
                this.dispatchEvent(event);
        }
        else{
            this.OTPTruthy = true;
            this.OTP = Math.floor(100000 + Math.random() * 900000);
            OTPSender({email: this.template.querySelector('lightning-input[data-id="email"]').value, otp: this.OTP})
            .then(result=>{

            })
            .catch(error=>{

            })
        }
    }

    monthChange(event){
        this.valueMon = parseInt(event.target.value);
    }

    yearChange(event){
        this.valueYear = parseInt(event.target.value);
    }

    giftonchange(){
        this.gift = this.template.querySelector('lightning-input[data-id="gift"]').checked;
    }

    handlePayNow(){
        if(this.template.querySelector('lightning-input[data-id="otp"]').value == this.OTP){
            const event = new ShowToastEvent({
                title: 'Payment Successful!',
                message: 'Your order has been placed successfully.',
                variant: 'success'
            });
            this.dispatchEvent(event);

            this.homePage = true;
            this.viewPage = false;
            this.buyPage = false;
            this.checkOutPage = false;
            this.cardmode = false;
            this.upimode = false;
            this.div2 = false;

        }
        else{
            const event = new ShowToastEvent({
                title: 'Error!',
                message: 'Entered OTP is invalid. Please enter the correct OTP.',
                variant: 'error'
            });
            this.dispatchEvent(event);
        }
    }
    
}