<template>
    <div id="app" class="app">
        <div class="bar">
            current currency
        </div>
        <div class="input">
            <multiselect
                    v-model="currencyFrom"
                    :options="currencyOptions"
                    selectLabel=""
                    :hideSelected="true"
                    @input="onInput"
            ></multiselect>
            <div class="border-animated input-value">
                <input autofocus class="input input-value" v-model.number="userValue" @keypress="isCurrency" @input="onInput" type="number" step="any">
                <div class="input-after"></div>
            </div>
        </div>
        <div class="output">
            <multiselect
                    v-model="currencyTo"
                    :options="currencyOptions"
                    selectLabel=""
                    :hideSelected="true"
                    @input="onInput"
            ></multiselect>
            <div class="output-value">
                <transition name="scaleIn">
                    <span v-show="convertedValue !== ''">{{ convertedValue }}</span>
                </transition>
            </div>
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
                socket.emit('broadcast', {
                    amount: this.userValue,
                    from: this.currencyFrom,
                    to: this.currencyTo
                });
            }, 200)
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
        background: $color-light;
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
        .multiselect__option--highlight {
            background: $color-accent;
        }
    }
    .input-value {
        border: 0;
        font-family: $font-family;
        font-size: 5rem;
        width: 100%;
        outline: none;
        height: 5rem;
        background: transparent;

        &.input {
            box-shadow: inset 0px -5px 0px -1px $color-accent;
        }
    }
    .output-value {
        font-size: 4rem;
        text-align: right;
        height: 4rem;
        width: 100%;
    }
    .bar {
        background: $color-accent;
        padding: 10px 10px 10px;
        margin: -10px -10px 0;
        text-align: center;
        color: $color-light;
    }

</style>
