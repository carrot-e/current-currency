<template>
    <div id="app" class="app">
        <div class="input">
            <multiselect
                    v-model="currencyFrom"
                    :options="currencyOptions"
                    selectLabel=""
                    hideSelected="true"
                    >
            </multiselect>
            <input autofocus class="input-value" v-model.number="userValue" v-on:keypress="isCurrency" v-on:input="onInput" type="number" step="any">
        </div>
        <div class="output">
            <multiselect
                    v-model="currencyTo"
                    :options="currencyOptions">
            </multiselect>
            <div class="output-value">{{ convertedValue }}</div>
        </div>
    </div>
</template>

<script>
    var debounce = require('debounce');
    var socket = io('http://localhost:4001');

    import Multiselect from 'vue-multiselect'

    export default {
        name: 'app',
        components: { Multiselect },
        data() {
            return {
                userValue: '',
                convertedValue: 0,
                currencyFrom: 'UAH',
                currencyTo: 'USD',
                currencyOptions: ['UAH', 'USD', 'EUR', 'AED']
            }
        },
        methods: {
            isCurrency(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },

            onInput: debounce(function() {
                this.convertedValue = '';
                socket.emit('broadcast', this.userValue);
            }, 300)
        },

        created() {
            var that = this;
            socket.on('converted', function(msg) {
                console.log(msg);
                that.convertedValue = msg.amount.toFixed(2);
            });
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
    @import './../scss/variables';
    .app {
        max-width: 480px;
        width: 100%;
        margin: 0 auto;
        padding: 10px;
        color: $color-dark;
        margin-top: 60px;
        box-shadow: 0 2px 3px 1px rgba($color-dark, 0.2);
    }
    .input,
    .output {
        display: flex;
        //border-bottom: 1px solid lighten($color-dark, 80%);
    }
    .multiselect {
        align-self: center;
        flex-basis: 100px;
        .multiselect__tags {
            border: 0;
        }
    }
    .input-value {
        border: 0;
        font-family: $font-family;
        font-size: 5rem;
        width: 100%;
        outline: none;
        height: 5rem;
    }
    .output-value {
        font-size: 4rem;
        text-align: right;
        height: 4rem;
        width: 100%;
    }

</style>
