<template>
  <div class="background">
    <div class="modal-window">
      <div class="modal-window__wrapper">
        <div class="modal-window__title">Choose a city</div>
        <div class="modal-window__description">
          To find city start typing and pick one from the suggestions
        </div>
        <div class="modal-window__search">
          <div>
            <input
              class="modal-window__search__input"
              placeholder="Search city"
              v-model.trim="v$.search.$model"
              @input="fetchCity"
            />
            <hr :class="v$.search.$error ? 'hr-error' : ''" />
            <div
              v-if="cityName && !v$.search.$error"
              class="city-from-response"
              @click="addCityFromResponse"
            >
              {{ cityName }}
            </div>
            <div class="error_message" v-if="v$.search.$error">
              <div v-for="(error, index) of v$.search.$errors" :key="index">
                {{ error.$message }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-window__action">
          <div
            class="modal-window__action__clear button"
            @click="clear"
            :class="search === '' ? 'disabled' : ''"
          >
            clear
          </div>
          <div class="modal-window__action__rightside">
            <div
              class="modal-window__action__rightside__cancel button"
              @click="cancel"
            >
              cancel
            </div>
            <div
              @click="add"
              class="modal-window__action__rightside__add button"
              :class="{
                disabled: v$.search.$error || !successSearch
              }"
            >
              add
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, alpha, helpers } from '@vuelidate/validators'
import { callWeather } from './helpers/weather'

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data () {
    return {
      search: '',
      cityName: null,
      successSearch: false
    }
  },
  validations () {
    return {
      search: {
        required: helpers.withMessage('Choose city', required),
        alpha
      }
    }
  },
  methods: {
    fetchCity () {
      this.successSearch = false

      callWeather(this.search).then(
        r => {
          this.cityName = r.data.name
          this.successSearch = true
        },
        () => {
          this.cityName = null
          this.successSearch = false
        }
      )
    },
    addCityFromResponse () {
      this.search = this.cityName
      this.cityName = null
    },
    clear () {
      this.search = ''
    },
    cancel () {
      this.$emit('cancel')
    },
    add () {
      this.$emit('add', this.search)
    }
  }
}
</script>

<style lang="scss">
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: rgba(11, 11, 11, 0.5);
  z-index: 1;
}
.modal-window {
  position: fixed;
  height: 373px;
  width: 100%;
  max-width: 677px;
  background: #fff;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;

  @media all and (max-width: 768px) {
    max-width: 80vw;
  }
  .modal-window__wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .modal-window__title {
    font-size: 32px;
    line-height: 38px;
    font-weight: 700;
    color: #1b1b1b;
  }

  .modal-window__description {
    font-size: 24px;
    line-height: 24px;
    padding-top: 16px;
    color: #767676;
  }

  .modal-window__search {
    width: 100%;
    padding-top: 67px;

    .modal-window__search__input {
      width: 100%;
      border: none;
      height: 24px;
      font-size: 24px;
      font-weight: 500;

      &::placeholder {
        font-size: 24px;
        line-height: 24px;
        color: #c1c1c1;
        font-weight: 500;
      }

      &:focus {
        border: none;
        outline: none;
      }
    }
  }

  .modal-window__action {
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: 0;
    width: 100%;

    .modal-window__action__rightside {
      display: flex;
      right: 0;

      .modal-window__action__rightside__cancel {
        padding-right: 31px;
      }
    }

    .button {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
      color: #9b51e0;
      text-transform: uppercase;
      cursor: pointer;
    }

    .disabled {
      color: #c1c1c1;
      pointer-events: none;
    }
  }

  .error_message {
    position: absolute;
    color: #ff0101;
  }

  .hr-error {
    border: 1px solid #ff0101;
  }

  .city-from-response {
    position: absolute;
    font-size: 29px;
    cursor: pointer;
  }
}
</style>
